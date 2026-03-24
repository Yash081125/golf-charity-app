export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4">
        Golf Charity Platform
      </h1>
      <p className="text-gray-400 mb-6">
        Play. Win. Give Back.
      </p>

      <a
        href="/dashboard"
        className="bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg text-white font-semibold transition"
      >
        Go to Dashboard
      </a>
    </main>
  );
}