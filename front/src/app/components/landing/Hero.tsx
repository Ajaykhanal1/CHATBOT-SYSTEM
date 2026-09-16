export default function Hero() {
  return (
    <section className="px-6 pb-24 pt-40 text-center">
      <div className="mx-auto max-w-4xl">

        <span className="rounded-full border px-4 py-2 text-sm">
          ✨ NEW · Talk with Documents
        </span>

        <h1 className="mt-8 text-5xl font-bold tracking-tight md:text-7xl">
          All-in-One
          <br />
          AI Chatbot
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          Access powerful AI models from one beautiful,
          simple and intelligent interface.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <a
            href="/chat"
            className="rounded-full bg-black px-7 py-3 text-white"
          >
            Get Started →
          </a>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-4">
          <div>
            <p className="text-3xl font-bold">35+</p>
            <p className="text-sm text-gray-500">Chat Models</p>
          </div>

          <div>
            <p className="text-3xl font-bold">10+</p>
            <p className="text-sm text-gray-500">Image Models</p>
          </div>

          <div>
            <p className="text-3xl font-bold">100%</p>
            <p className="text-sm text-gray-500">Secure</p>
          </div>
        </div>

      </div>
    </section>
  );
}