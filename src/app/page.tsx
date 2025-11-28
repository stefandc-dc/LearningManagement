import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="flex items-center justify-between p-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">LMS Platform</span>
        </div>
        <Link
          href="/login"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
        >
          Sign In
        </Link>
      </header>

      <main className="flex flex-grow flex-col items-center justify-center p-6 text-center">
        <div className="max-w-2xl space-y-8">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Master the <span className="text-blue-600">SDLC</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Welcome to the internal learning platform for our consultancy.
            Enhance your skills, track your progress, and stay up-to-date with the latest software development practices.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="group flex items-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg"
            >
              Get Started
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-gray-500 border-t border-gray-100">
        &copy; {new Date().getFullYear()} IT Consultancy Firm. All rights reserved.
      </footer>
    </div>
  );
}
