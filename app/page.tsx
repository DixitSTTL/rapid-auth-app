
export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center font-sans" style={{ background: "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)" }}>
      <div className="flex flex-col items-center gap-8 p-10 rounded-xl shadow-lg bg-white/90 dark:bg-zinc-900/90">
        <h1 className="text-4xl font-bold text-blue-700 dark:text-zinc-50 mb-2">Welcome to Rapid Auth App</h1>
        <p className="text-lg text-zinc-700 dark:text-zinc-300 mb-6">Secure, fast authentication for your Next.js project. Please log in or sign up to continue.</p>
        <div className="flex flex-col gap-4 w-full max-w-xs">
          <a
            className="flex h-12 w-full items-center justify-center rounded-full bg-blue-600 text-white text-lg font-semibold px-5 transition-colors hover:bg-blue-700"
            href="/login"
          >
            Login
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full bg-green-600 text-white text-lg font-semibold px-5 transition-colors hover:bg-green-700"
            href="/signup"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  );
}
