const features = [
  {
    title: "Multiple AI Models",
    description: "Access GPT, Claude, Gemini, DeepSeek and more from one unified workspace.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.2" />
        <path d="M10 3v14M3 10h14" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    title: "Web Search",
    description: "Get real-time answers with grounded web search built directly into chat.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="1.2" />
        <path d="M13.5 13.5L17 17" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Chat with Documents",
    description: "Upload PDFs, TXT, DOCX and more to summarize, analyze or ask anything.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="5" y="4" width="10" height="12" rx="2" stroke="currentColor" strokeWidth="1.2" />
        <path d="M8 7h4M8 10h4M8 13h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Image Generation",
    description: "Create stunning visuals from text with state-of-the-art image models.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="4" y="5" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="8" cy="9" r="1" fill="currentColor" />
        <path d="M4 13l3-3 2 2 4-4 3 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Voice Chat",
    description: "Speak naturally and get fluid, human-like responses in real time.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect x="9" y="3" width="2" height="8" rx="1" stroke="currentColor" strokeWidth="1.2" />
        <path d="M6 9a4 4 0 008 0M10 13v4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Smart Chat History",
    description: "Organized, searchable conversations so you can pick up exactly where you left off.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.2" />
        <path d="M10 6v4l2.5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function Features() {
  return (
    <section id="features" className="relative px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="text-center">
          <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-muted-foreground">
            Everything in one place
          </span>
          <h2 className="mt-6 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Powerful tools to accelerate your work
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-lg text-muted-foreground">
            From research to creation, MyChat gives you the right model and tools for every task.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-6 backdrop-blur transition-all hover:-translate-y-1 hover:border-white/20"
            >
              <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-gradient-to-br from-primary/30 to-accent/20 blur-3xl" />
              <div className="relative mb-5 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-foreground">
                {feature.icon}
              </div>
              <h3 className="relative text-lg font-semibold">{feature.title}</h3>
              <p className="relative mt-2 text-sm text-muted-foreground">{feature.description}</p>
              <div className="relative mt-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors group-hover:text-foreground">
                Learn more
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}