"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { ContentType } from "@prisma/client";

const createContentSchema = z.object({
    title: z.string().min(3),
    type: z.nativeEnum(ContentType),
    data: z.string(), // We'll parse this based on type
    moduleId: z.string(),
    courseId: z.string(),
});

export async function createContent(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id || (session.user.role !== "CREATOR" && session.user.role !== "ADMIN")) {
        throw new Error("Unauthorized");
    }

    const title = formData.get("title") as string;
    const type = formData.get("type") as ContentType;
    const contentData = formData.get("content") as string;
    const moduleId = formData.get("moduleId") as string;
    const courseId = formData.get("courseId") as string;

    if (!title || !type || !moduleId) return { error: "Missing fields" };

    try {
        // Get highest order
        const lastContent = await prisma.content.findFirst({
            where: { moduleId },
            orderBy: { order: "desc" },
        });
        const newOrder = (lastContent?.order ?? 0) + 1;

        await prisma.content.create({
            data: {
                title,
                type,
                data: contentData, // Store raw string or JSON
                moduleId,
                order: newOrder,
                status: "DRAFT",
            },
        });

        revalidatePath(`/dashboard/creator/courses/${courseId}`);
        return { success: true };
    } catch (error) {
        console.error(error);
        return { error: "Failed to create content" };
    }
}
