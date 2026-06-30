import Link from "next/link";

export default function Landing() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Ambient glow signature element */}
      <div className="absolute w-[600px] h-[600px] bg-amber/10 rounded-full blur-[120px] -top-40 -right-20 animate-pulse-slow" />
      <div className="absolute w-[400px] h-[400px] bg-amber/5 rounded-full blur-[100px] bottom-0 left-10" />

      <div className="relative z-10 max-w-xl text-center">
        <p className="text-muted text-sm tracking-widest uppercase mb-6">
          A private space to think
        </p>
        <h1 className="font-display text-5xl md:text-6xl font-medium leading-tight mb-6">
          Write it down.
          <br />
          <span className="text-amber italic">Keep it yours.</span>
        </h1>
        <p className="text-muted text-lg mb-10 leading-relaxed">
          Quiet is a journal that never leaves your device. No accounts,
          no cloud, no one reading your words — including the AI that
          reflects on them.
        </p>

        <Link
          href="/journal"
          className="inline-block bg-amber text-ink font-medium px-8 py-3 rounded-full hover:bg-amber/90 transition-colors"
        >
          Start writing →
        </Link>

        <div className="mt-16 grid grid-cols-3 gap-6 text-left">
          <div>
            <p className="font-display text-amber text-2xl mb-1">100%</p>
            <p className="text-muted text-sm">Stored on your device</p>
          </div>
          <div>
            <p className="font-display text-amber text-2xl mb-1">0</p>
            <p className="text-muted text-sm">Servers involved</p>
          </div>
          <div>
            <p className="font-display text-amber text-2xl mb-1">Local</p>
            <p className="text-muted text-sm">AI reflections, on-device</p>
          </div>
        </div>
      </div>
    </main>
  );
}