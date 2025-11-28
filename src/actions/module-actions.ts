"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createModuleSchema = z.object({
    title: z.string().min(3),
    courseId: z.string(),
});

export async function createModule(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id || (session.user.role !== "CREATOR" && session.user.role !== "ADMIN")) {
        throw new Error("Unauthorized");
    }

    const title = formData.get("title") as string;
    const courseId = formData.get("courseId") as string;

    if (!title || !courseId) return { error: "Missing fields" };

    try {
        // Get highest order
        const lastModule = await prisma.module.findFirst({
            where: { courseId },
            orderBy: { order: "desc" },
        });
        const newOrder = (lastModule?.order ?? 0) + 1;

        await prisma.module.create({
            data: {
                title,
                courseId,
                order: newOrder,
            },
        });

        revalidatePath(`/dashboard/creator/courses/${courseId}`);
        return { success: true };
    } catch (error) {
        return { error: "Failed to create module" };
    }
}

export async function deleteModule(moduleId: string, courseId: string) {
    const session = await auth();
    if (!session?.user?.id || (session.user.role !== "CREATOR" && session.user.role !== "ADMIN")) {
        throw new Error("Unauthorized");
    }

    try {
        await prisma.module.delete({
            where: { id: moduleId }
        });
        revalidatePath(`/dashboard/creator/courses/${courseId}`);
        return { success: true };
    } catch (error) {
        return { error: "Failed to delete module" };
    }
}
