import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

async function updateUserRole(formData: FormData) {
    "use server";
    const userId = formData.get("userId") as string;
    const role = formData.get("role") as Role;

    if (!userId || !role) return;

    await prisma.user.update({
        where: { id: userId },
        data: { role }
    });
    revalidatePath("/dashboard/admin");
}

export default async function AdminDashboard() {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
        redirect("/dashboard");
    }

    const users = await prisma.user.findMany({
        orderBy: { name: "asc" }
    });

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>

            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-lg font-medium text-gray-900">User Management</h3>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-gray-900">{user.name || "Unknown"}</span>
                                        <span className="text-xs text-gray-500">{user.email}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <form action={updateUserRole} className="flex items-center gap-2">
                                        <input type="hidden" name="userId" value={user.id} />
                                        <select
                                            name="role"
                                            defaultValue={user.role}
                                            className="rounded-md border-gray-300 text-sm focus:border-blue-500 focus:ring-blue-500"
                                        >
                                            {Object.values(Role).map((r) => (
                                                <option key={r} value={r}>{r}</option>
                                            ))}
                                        </select>
                                        <button
                                            type="submit"
                                            className="text-blue-600 hover:text-blue-900 text-xs font-medium"
                                        >
                                            Update
                                        </button>
                                    </form>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
