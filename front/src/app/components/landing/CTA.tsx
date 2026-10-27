export default function CTA() {
  return (
    <section id="contact" className="relative px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto w-full max-w-[1200px] overflow-hidden rounded-[2.5rem] border border-white/10">
        <div className="relative px-6 py-16 text-center sm:px-12 md:py-20">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/40 via-accent/30 to-transparent" />
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12),_transparent_60%)]" />
          <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white/80 backdrop-blur">
            Ready when you are
          </span>
          <h2 className="mt-6 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Your AI workspace awaits
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-lg text-white/80">
            Chat, create, research and solve with every leading model in one seamless platform.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="/chat"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-white px-8 py-3 text-base font-medium text-black shadow-xl shadow-white/10 transition-all hover:-translate-y-0.5"
            >
              <span className="relative z-10">Start Chatting</span>
              <span className="relative z-10 transition-transform group-hover:translate-x-1">→</span>
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/0 via-black/5 to-white/0 transition-transform duration-700 group-hover:translate-x-full" />
            </a>
            <a
              href="/register"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-3 text-base text-white backdrop-blur transition-all hover:border-white/60 hover:bg-white/10"
            >
              Create free account
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}