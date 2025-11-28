import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PlayCircle, CheckCircle, Lock } from "lucide-react";

export default async function CourseOverviewPage({ params }: { params: { courseId: string } }) {
    const session = await auth();
    if (!session?.user) return null;

    const course = await prisma.course.findUnique({
        where: { id: params.courseId },
        include: {
            modules: {
                orderBy: { order: "asc" },
                include: {
                    contents: {
                        orderBy: { order: "asc" }
                    }
                }
            },
        },
    });

    if (!course) notFound();

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
                <p className="mt-4 text-gray-600 leading-relaxed">{course.description}</p>

                <div className="mt-8">
                    <button className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-6 py-3 text-base font-medium text-white hover:bg-blue-700">
                        <PlayCircle className="h-5 w-5" />
                        Continue Learning
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900">Course Content</h2>

                <div className="space-y-4">
                    {course.modules.map((module, index) => (
                        <div key={module.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                                <h3 className="font-semibold text-gray-900">Module {index + 1}: {module.title}</h3>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {module.contents.map((content) => (
                                    <div key={content.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                                                {content.type === 'VIDEO' ? 'V' : content.type === 'QUIZ' ? 'Q' : 'T'}
                                            </div>
                                            <span className="text-sm font-medium text-gray-700">{content.title}</span>
                                        </div>
                                        <Link
                                            href={`/dashboard/courses/${course.id}/learn/${content.id}`}
                                            className="text-sm text-blue-600 hover:underline"
                                        >
                                            Start
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
