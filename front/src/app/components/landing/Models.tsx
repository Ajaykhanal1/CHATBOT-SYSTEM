const models = [
  {
    name: "GPT",
    description: "General purpose reasoning and conversation",
    gradient: "from-violet-400/80 to-fuchsia-400/80",
  },
  {
    name: "Claude",
    description: "Exceptional writing, analysis and long context",
    gradient: "from-sky-400/80 to-cyan-400/80",
  },
  {
    name: "Gemini",
    description: "Multimodal understanding across text, image and video",
    gradient: "from-emerald-400/80 to-teal-400/80",
  },
  {
    name: "DeepSeek",
    description: "Advanced coding, math and technical reasoning",
    gradient: "from-amber-300/80 to-orange-400/80",
  },
];

export default function Models() {
  return (
    <section id="models" className="relative px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="text-center">
          <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-muted-foreground">
            Unified Model Access
          </span>
          <h2 className="mt-6 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            One interface. Every leading model.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-lg text-muted-foreground">
            Switch between top-tier models on the fly to match the task at hand.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {models.map((model) => (
            <a
              key={model.name}
              href="/chat"
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 backdrop-blur transition-all hover:-translate-y-1 hover:border-white/20 hover:shadow-xl hover:shadow-primary/10"
            >
              <div
                className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-gradient-to-br opacity-30 blur-3xl transition-opacity group-hover:opacity-60"
                style={{ backgroundImage: "linear-gradient(135deg, var(--tw-gradient-stops))" }}
              />
              <div className={`relative mb-6 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${model.gradient}`}>
                <span className="text-sm font-semibold">AI</span>
              </div>
              <h3 className="relative text-xl font-semibold">{model.name}</h3>
              <p className="relative mt-2 text-sm text-muted-foreground">{model.description}</p>
              <div className="relative mt-6 inline-flex items-center gap-2 text-sm text-foreground">
                Try model
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}