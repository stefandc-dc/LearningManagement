import Link from "next/link";
import { auth } from "@/auth";
import {
    BookOpen,
    LayoutDashboard,
    Settings,
    Users,
    FileEdit,
    CheckCircle,
    LogOut
} from "lucide-react";
import { signOut } from "@/auth";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();
    const role = session?.user?.role;

    return (
        <div className="flex h-screen w-full flex-col md:flex-row md:overflow-hidden">
            <div className="w-full flex-none md:w-64 bg-gray-900 text-white p-4 flex flex-col justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-8 px-2">
                        <BookOpen className="h-8 w-8 text-blue-400" />
                        <span className="text-xl font-bold">LMS Platform</span>
                    </div>

                    <nav className="space-y-2">
                        <NavLink href="/dashboard" icon={LayoutDashboard} label="Dashboard" />

                        {/* Learner Links */}
                        {(role === "LEARNER" || role === "ADMIN") && (
                            <NavLink href="/dashboard/courses" icon={BookOpen} label="My Courses" />
                        )}

                        {/* Creator Links */}
                        {(role === "CREATOR" || role === "ADMIN") && (
                            <NavLink href="/dashboard/creator" icon={FileEdit} label="Content Creator" />
                        )}

                        {/* Validator Links */}
                        {(role === "VALIDATOR" || role === "ADMIN") && (
                            <NavLink href="/dashboard/validator" icon={CheckCircle} label="Validation Queue" />
                        )}

                        {/* Manager Links */}
                        {(role === "MANAGER" || role === "ADMIN") && (
                            <NavLink href="/dashboard/team" icon={Users} label="Team Progress" />
                        )}

                        {/* Admin Links */}
                        {role === "ADMIN" && (
                            <NavLink href="/dashboard/admin" icon={Settings} label="Admin Panel" />
                        )}
                    </nav>
                </div>

                <div className="border-t border-gray-700 pt-4">
                    <div className="flex items-center gap-3 px-2 mb-4">
                        {session?.user?.image ? (
                            <img src={session.user.image} alt="User" className="h-8 w-8 rounded-full" />
                        ) : (
                            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold">
                                {session?.user?.name?.[0] || "U"}
                            </div>
                        )}
                        <div className="text-sm">
                            <p className="font-medium">{session?.user?.name}</p>
                            <p className="text-xs text-gray-400 capitalize">{role?.toLowerCase()}</p>
                        </div>
                    </div>
                    <form action={async () => {
                        "use server";
                        await signOut();
                    }}>
                        <button className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm font-medium hover:bg-gray-800 text-red-400">
                            <LogOut className="h-5 w-5" />
                            Sign Out
                        </button>
                    </form>
                </div>
            </div>
            <div className="flex-grow p-6 md:overflow-y-auto md:p-12 bg-gray-50">
                {children}
            </div>
        </div>
    );
}

function NavLink({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-800 hover:text-blue-400 transition-colors"
        >
            <Icon className="h-5 w-5" />
            {label}
        </Link>
    );
}
