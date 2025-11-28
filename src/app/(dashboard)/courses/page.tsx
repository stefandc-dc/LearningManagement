import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { BookOpen, PlayCircle } from "lucide-react";

export default async function CourseCatalogPage() {
    const session = await auth();
    if (!session?.user) return null;

    const courses = await prisma.course.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
        include: {
            _count: {
                select: { modules: true }
            },
            author: {
                select: { name: true }
            }
        }
    });

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Course Catalog</h1>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                    <div
                        key={course.id}
                        className="flex flex-col justify-between rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md overflow-hidden"
                    >
                        <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center">
                            <BookOpen className="h-12 w-12 text-white opacity-50" />
                        </div>
                        <div className="p-6 flex-grow">
                            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{course.title}</h3>
                            <p className="mt-1 text-xs text-gray-500">By {course.author.name}</p>
                            <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                                {course.description || "No description provided."}
                            </p>
                            <p className="mt-4 text-xs text-gray-400">
                                {course._count.modules} Modules
                            </p>
                        </div>

                        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                            <Link
                                href={`/dashboard/courses/${course.id}`}
                                className="flex w-full items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                            >
                                <PlayCircle className="h-4 w-4" />
                                Start Learning
                            </Link>
                        </div>
                    </div>
                ))}

                {courses.length === 0 && (
                    <div className="col-span-full text-center py-12">
                        <p className="text-gray-500">No courses available yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
