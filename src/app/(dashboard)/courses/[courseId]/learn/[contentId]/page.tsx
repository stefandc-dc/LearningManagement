import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ContentPlayer from "@/components/content-player";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function LearnPage({
    params
}: {
    params: { courseId: string; contentId: string }
}) {
    const session = await auth();
    if (!session?.user) return null;

    const content = await prisma.content.findUnique({
        where: { id: params.contentId },
    });

    if (!content) notFound();

    // Find next content
    const nextContent = await prisma.content.findFirst({
        where: {
            moduleId: content.moduleId,
            order: { gt: content.order }
        },
        orderBy: { order: "asc" }
    });

    return (
        <div className="space-y-6">
            <Link
                href={`/dashboard/courses/${params.courseId}`}
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
            >
                <ChevronLeft className="h-4 w-4" />
                Back to Course Overview
            </Link>

            <ContentPlayer
                content={content}
                courseId={params.courseId}
                nextContentId={nextContent?.id}
            />
        </div>
    );
}
