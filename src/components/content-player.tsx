"use client";

import { Content, ContentType } from "@prisma/client";
import { updateProgress } from "@/actions/progress-actions";
import { useState } from "react";
import { CheckCircle, Circle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ContentPlayer({
    content,
    courseId,
    nextContentId
}: {
    content: Content;
    courseId: string;
    nextContentId?: string;
}) {
    const router = useRouter();
    const [completed, setCompleted] = useState(false);

    async function handleComplete() {
        setCompleted(true);
        await updateProgress(content.id, courseId, true);
        if (nextContentId) {
            router.push(`/dashboard/courses/${courseId}/learn/${nextContentId}`);
        } else {
            router.push(`/dashboard/courses/${courseId}`);
        }
    }

    return (
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">{content.title}</h1>

            <div className="prose max-w-none mb-8">
                {content.type === "TEXT" && (
                    <div className="whitespace-pre-wrap font-sans text-gray-700">
                        {content.data as string}
                    </div>
                )}

                {content.type === "VIDEO" && (
                    <div className="aspect-video bg-black rounded-lg flex items-center justify-center text-white">
                        {/* Placeholder for video player */}
                        <p>Video Player Placeholder: {content.data as string}</p>
                    </div>
                )}

                {content.type === "QUIZ" && (
                    <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                        <h3 className="font-semibold text-yellow-800">Quiz Content</h3>
                        <p className="text-sm text-yellow-700 mt-2">Quiz rendering logic to be implemented.</p>
                        <pre className="mt-4 bg-white p-4 rounded text-xs overflow-auto">
                            {JSON.stringify(content.data, null, 2)}
                        </pre>
                    </div>
                )}
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-100">
                <button
                    onClick={handleComplete}
                    className="flex items-center gap-2 rounded-md bg-green-600 px-6 py-3 text-sm font-medium text-white hover:bg-green-700 transition-colors"
                >
                    {completed ? <CheckCircle className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                    {completed ? "Completed" : "Mark as Complete & Next"}
                </button>
            </div>
        </div>
    );
}
