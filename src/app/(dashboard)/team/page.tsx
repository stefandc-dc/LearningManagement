import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export default async function TeamDashboard() {
    const session = await auth();
    if (!session?.user || (session.user.role !== "MANAGER" && session.user.role !== "ADMIN")) {
        redirect("/dashboard");
    }

    const teamMembers = await prisma.user.findMany({
        where: {
            managerId: session.user.role === "ADMIN" ? undefined : session.user.id,
        },
        include: {
            progress: {
                where: { status: "COMPLETED" },
                include: {
                    content: true
                }
            },
            quizResults: true
        }
    });

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Team Progress</h1>

            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completed Units</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Quiz Score</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {teamMembers.map((member) => {
                            const avgScore = member.quizResults.length > 0
                                ? Math.round(member.quizResults.reduce((acc, curr) => acc + curr.score, 0) / member.quizResults.length)
                                : "-";

                            return (
                                <tr key={member.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600 mr-3">
                                                {member.name?.[0] || "U"}
                                            </div>
                                            <div className="text-sm font-medium text-gray-900">{member.name || "Unknown"}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{member.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{member.progress.length}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{avgScore}%</td>
                                </tr>
                            );
                        })}
                        {teamMembers.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                                    No team members assigned.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
