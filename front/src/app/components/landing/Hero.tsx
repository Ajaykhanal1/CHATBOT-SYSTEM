export default function Hero() {
  return (
    <section className="relative px-4 pb-16 pt-28 text-center sm:px-6 sm:pb-20 sm:pt-36 lg:px-8">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-muted-foreground backdrop-blur">
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-gradient-to-r from-primary to-accent" />
          <span>NEW · Talk with Documents</span>
        </div>

        <h1 className="mt-8 text-balance text-5xl font-semibold tracking-tight text-glow sm:text-6xl md:text-7xl lg:text-8xl">
          One Workspace.
          <br />
          <span className="bg-gradient-to-r from-white via-white/90 to-white/60 bg-clip-text text-transparent">
            Every AI Model.
          </span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground md:text-xl">
          Access powerful AI models in one sleek, secure, and intelligent interface.
          Chat, reason, create, and analyze without switching tabs.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="/chat"
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-primary to-accent px-8 py-3 text-base font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-primary/40"
          >
            <span className="relative z-10">Start Chatting</span>
            <span className="relative z-10 transition-transform group-hover:translate-x-1">→</span>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-white/25 to-white/0 transition-transform duration-700 group-hover:translate-x-full" />
          </a>
          <a
            href="#models"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-3 text-base text-foreground backdrop-blur transition-all hover:border-white/20 hover:bg-white/10"
          >
            Explore Models
          </a>
        </div>

        <div className="card-glow mt-12 grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-2 backdrop-blur sm:mt-16 sm:gap-4 sm:rounded-3xl sm:p-6">
          <div className="rounded-xl px-2 py-4 text-center sm:rounded-2xl sm:px-6 sm:py-6">
            <p className="text-2xl font-semibold tracking-tight sm:text-4xl md:text-5xl">35+</p>
            <p className="mt-1 text-[10px] text-muted-foreground sm:mt-2 sm:text-sm">Chat Models</p>
          </div>
          <div className="rounded-xl px-2 py-4 text-center sm:rounded-2xl sm:border-l sm:border-r sm:border-white/10 sm:px-6 sm:py-6">
            <p className="text-2xl font-semibold tracking-tight sm:text-4xl md:text-5xl">10+</p>
            <p className="mt-1 text-[10px] text-muted-foreground sm:mt-2 sm:text-sm">Image Models</p>
          </div>
          <div className="rounded-xl px-2 py-4 text-center sm:rounded-2xl sm:px-6 sm:py-6">
            <p className="text-2xl font-semibold tracking-tight sm:text-4xl md:text-5xl">100%</p>
            <p className="mt-1 text-[10px] text-muted-foreground sm:mt-2 sm:text-sm">Secure & Private</p>
          </div>
        </div>
      </div>
    </section>
  );
}