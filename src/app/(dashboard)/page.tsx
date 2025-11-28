import { auth } from "@/auth";

export default async function DashboardPage() {
    const session = await auth();

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">
                Welcome back, <span className="font-semibold">{session?.user?.name}</span>!
            </p>

            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Placeholder cards */}
                <div className="bg-white overflow-hidden shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900">Your Progress</h3>
                    <p className="mt-1 text-3xl font-semibold text-blue-600">0%</p>
                    <p className="text-sm text-gray-500">Courses completed</p>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900">Active Courses</h3>
                    <p className="mt-1 text-3xl font-semibold text-green-600">0</p>
                    <p className="text-sm text-gray-500">Enrolled</p>
                </div>
            </div>
        </div>
    );
}
