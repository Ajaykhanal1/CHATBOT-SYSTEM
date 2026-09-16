const features = [
  {
    icon: "✦",
    title: "Multiple AI Models",
    description:
      "Use different AI models from one simple and powerful interface.",
  },
  {
    icon: "⌕",
    title: "Web Search",
    description:
      "Search the web and get useful information directly inside your conversation.",
  },
  {
    icon: "◫",
    title: "Chat with Documents",
    description:
      "Upload PDF and other documents and ask questions about their content.",
  },
  {
    icon: "◉",
    title: "Image Generation",
    description:
      "Create beautiful AI-generated images from simple text prompts.",
  },
  {
    icon: "◌",
    title: "Voice Chat",
    description:
      "Interact with your AI assistant using voice conversations.",
  },
  {
    icon: "↺",
    title: "Chat History",
    description:
      "Your conversations are organized so you can continue them anytime.",
  },
];

export default function Features() {
  return (
    <section id="features" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
            Features
          </p>

          <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
            Everything you need
            <br />
            in one AI platform
          </h2>

          <p className="mt-5 text-gray-600">
            Powerful AI tools designed to make your everyday work,
            learning and creativity easier.
          </p>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-3xl border border-gray-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-xl text-white">
                {feature.icon}
              </div>

              <h3 className="mt-6 text-xl font-semibold">
                {feature.title}
              </h3>

              <p className="mt-3 leading-7 text-gray-500">
                {feature.description}
              </p>

              <div className="mt-6 text-sm font-medium">
                Learn more →
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}