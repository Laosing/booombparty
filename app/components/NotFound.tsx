import { Link } from "@tanstack/react-router"
import { Logo } from "./Logo"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-base-300 to-base-100 relative overflow-hidden">
      <div className="card bg-base-100/50 backdrop-blur-md shadow-2xl border border-base-content/5 max-w-lg w-full p-8 relative z-10 transition-all hover:scale-105 duration-500">
        <Logo random showText={false} size={128} />

        <h1 className="text-3xl font-bold my-6">404 Page Not Found</h1>
        <p className="opacity-70 mb-8 text-lg">
          The page you're looking for has been deleted or never existed in the
          first place.
        </p>

        <Link
          to="/"
          search={{ error: undefined, room: undefined }}
          className="btn btn-primary btn-lg gap-2 group transition-all"
        >
          <span>Return to Lobby</span>
          <span className="group-hover:translate-x-1 transition-transform">
            →
          </span>
        </Link>
      </div>

      <div className="mt-8 text-sm opacity-30 font-mono">
        Error Code: 404_PAGE_NOT_FOUND
      </div>
    </div>
  )
}
