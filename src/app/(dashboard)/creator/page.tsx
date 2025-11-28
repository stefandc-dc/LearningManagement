import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import { deleteCourse } from "@/actions/course-actions";

export default async function CreatorDashboard() {
    const session = await auth();
    if (!session?.user) return null;

    const courses = await prisma.course.findMany({
        where: {
            authorId: session.user.role === "ADMIN" ? undefined : session.user.id,
        },
        orderBy: { createdAt: "desc" },
        include: {
            _count: {
                select: { modules: true }
            }
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
                <Link
                    href="/dashboard/creator/new"
                    className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                    <Plus className="h-4 w-4" />
                    New Course
                </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                    <div
                        key={course.id}
                        className="flex flex-col justify-between rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                    >
                        <div>
                            <div className="flex items-start justify-between">
                                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{course.title}</h3>
                                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${course.published ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                                    }`}>
                                    {course.published ? "Published" : "Draft"}
                                </span>
                            </div>
                            <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                                {course.description || "No description provided."}
                            </p>
                            <p className="mt-4 text-xs text-gray-400">
                                {course._count.modules} Modules • Updated {course.updatedAt.toLocaleDateString()}
                            </p>
                        </div>

                        <div className="mt-6 flex items-center gap-3 border-t border-gray-100 pt-4">
                            <Link
                                href={`/dashboard/creator/courses/${course.id}`}
                                className="flex flex-1 items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                <Edit className="h-4 w-4" />
                                Edit
                            </Link>
                            <form action={async () => {
                                "use server";
                                await deleteCourse(course.id);
                            }}>
                                <button
                                    type="submit"
                                    className="flex items-center justify-center rounded-md border border-transparent bg-red-50 p-2 text-red-600 hover:bg-red-100"
                                    title="Delete Course"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </form>
                        </div>
                    </div>
                ))}

                {courses.length === 0 && (
                    <div className="col-span-full flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
                        <h3 className="mt-2 text-sm font-semibold text-gray-900">No courses</h3>
                        <p className="mt-1 text-sm text-gray-500">Get started by creating a new course.</p>
                        <div className="mt-6">
                            <Link
                                href="/dashboard/creator/new"
                                className="inline-flex items-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
                            >
                                <Plus className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
                                New Course
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
