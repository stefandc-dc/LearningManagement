"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const createCourseSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().optional(),
});

export async function createCourse(formData: FormData) {
    const session = await auth();
    if (!session?.user?.id || (session.user.role !== "CREATOR" && session.user.role !== "ADMIN")) {
        throw new Error("Unauthorized");
    }

    const validatedFields = createCourseSchema.safeParse({
        title: formData.get("title"),
        description: formData.get("description"),
    });

    if (!validatedFields.success) {
        return { error: "Invalid fields" };
    }

    const { title, description } = validatedFields.data;

    try {
        const course = await prisma.course.create({
            data: {
                title,
                description,
                authorId: session.user.id,
            },
        });

        revalidatePath("/dashboard/creator");
        return { success: true, courseId: course.id };
    } catch (error) {
        console.error("Failed to create course:", error);
        return { error: "Failed to create course" };
    }
}

export async function deleteCourse(courseId: string) {
    const session = await auth();
    if (!session?.user?.id || (session.user.role !== "CREATOR" && session.user.role !== "ADMIN")) {
        throw new Error("Unauthorized");
    }

    try {
        await prisma.course.delete({
            where: {
                id: courseId,
                authorId: session.user.role === "ADMIN" ? undefined : session.user.id
            }
        });
        revalidatePath("/dashboard/creator");
        return { success: true };
    } catch (error) {
        return { error: "Failed to delete course" };
    }
}
