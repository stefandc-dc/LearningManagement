"use client";

import { createContent } from "@/actions/content-actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewContentPage({ params }: { params: { courseId: string; moduleId: string } }) {
    const router = useRouter();
    const [type, setType] = useState("TEXT");
    const [isPending, setIsPending] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsPending(true);
        // Append IDs
        formData.append("courseId", params.courseId);
        formData.append("moduleId", params.moduleId);

        const result = await createContent(formData);

        if (result.success) {
            router.push(`/dashboard/creator/courses/${params.courseId}`);
        } else {
            alert("Failed to create content");
            setIsPending(false);
        }
    }

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Add Content</h1>

            <form action={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        name="title"
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <select
                        name="type"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                    >
                        <option value="TEXT">Text / Markdown</option>
                        <option value="VIDEO">Video URL</option>
                        <option value="QUIZ">Quiz (JSON)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">
                        {type === "TEXT" ? "Content (Markdown)" : type === "VIDEO" ? "Video URL" : "Quiz Data (JSON)"}
                    </label>
                    <textarea
                        name="content"
                        rows={10}
                        required
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none font-mono text-sm"
                        placeholder={type === "TEXT" ? "# Introduction\n\nWrite your content here..." : "https://..."}
                    />
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
                    >
                        {isPending ? "Saving..." : "Save Content"}
                    </button>
                </div>
            </form>
        </div>
    );
}
