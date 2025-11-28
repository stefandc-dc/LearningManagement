import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { createModule, deleteModule } from "@/actions/module-actions";
import { Plus, Trash2, GripVertical, FileText } from "lucide-react";
import Link from "next/link";

export default async function CourseEditorPage({ params }: { params: { courseId: string } }) {
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

    // Verify ownership
    if (session.user.role !== "ADMIN" && course.authorId !== session.user.id) {
        return <div className="p-6 text-red-600">Unauthorized access to this course.</div>;
    }

    return (
        <div className="space-y-8">
            <div className="border-b border-gray-200 pb-5">
                <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
                <p className="mt-2 text-gray-500">{course.description}</p>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">Modules</h2>
                    {/* Add Module Form */}
                    <form action={async (formData) => {
                        "use server";
                        await createModule(formData);
                    }} className="flex gap-2">
                        <input type="hidden" name="courseId" value={course.id} />
                        <input
                            type="text"
                            name="title"
                            placeholder="New Module Title"
                            required
                            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none"
                        />
                        <button
                            type="submit"
                            className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700"
                        >
                            <Plus className="h-4 w-4" /> Add
                        </button>
                    </form>
                </div>

                <div className="space-y-4">
                    {course.modules.map((module) => (
                        <div key={module.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <GripVertical className="h-5 w-5 text-gray-400 cursor-move" />
                                    <h3 className="font-medium text-gray-900">{module.title}</h3>
                                </div>
                                <form action={async () => {
                                    "use server";
                                    await deleteModule(module.id, course.id);
                                }}>
                                    <button type="submit" className="text-gray-400 hover:text-red-600">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </form>
                            </div>

                            {/* Content List Placeholder */}
                            <div className="ml-8 space-y-2">
                                {module.contents.map((content) => (
                                    <div key={content.id} className="flex items-center justify-between rounded bg-gray-50 p-2 text-sm">
                                        <span className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-gray-500" />
                                            {content.title}
                                        </span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full ${content.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'
                                            }`}>
                                            {content.status}
                                        </span>
                                    </div>
                                ))}

                                <Link
                                    href={`/dashboard/creator/courses/${course.id}/modules/${module.id}/new`}
                                    className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 mt-2"
                                >
                                    <Plus className="h-3 w-3" /> Add Content
                                </Link>
                            </div>
                        </div>
                    ))}

                    {course.modules.length === 0 && (
                        <p className="text-center text-gray-500 py-8 italic">No modules yet. Add one above.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
