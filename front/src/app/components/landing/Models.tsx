const models = [
  {
    name: "GPT",
    description: "General purpose AI",
  },
  {
    name: "Claude",
    description: "Writing and reasoning",
  },
  {
    name: "Gemini",
    description: "Multimodal AI",
  },
  {
    name: "DeepSeek",
    description: "Coding and reasoning",
  },
];

export default function Models() {
  return (
    <section id="models" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">

        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase">
            AI Models
          </p>

          <h2 className="mt-3 text-4xl font-bold">
            One interface. Multiple AI models.
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-4">
          {models.map((model) => (
            <div
              key={model.name}
              className="rounded-3xl border p-6 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-black text-white">
                AI
              </div>

              <h3 className="text-xl font-semibold">
                {model.name}
              </h3>

              <p className="mt-2 text-gray-500">
                {model.description}
              </p>

              <button className="mt-6 text-sm font-medium">
                Try model →
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}