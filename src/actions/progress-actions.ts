"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProgress(contentId: string, courseId: string, completed: boolean) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    try {
        await prisma.progress.upsert({
            where: {
                userId_contentId: {
                    userId: session.user.id,
                    contentId: contentId,
                },
            },
            update: {
                status: completed ? "COMPLETED" : "IN_PROGRESS",
                completedAt: completed ? new Date() : null,
            },
            create: {
                userId: session.user.id,
                contentId: contentId,
                status: completed ? "COMPLETED" : "IN_PROGRESS",
                completedAt: completed ? new Date() : null,
            },
        });

        revalidatePath(`/dashboard/courses/${courseId}`);
        return { success: true };
    } catch (error) {
        console.error("Failed to update progress:", error);
        return { error: "Failed to update progress" };
    }
}
