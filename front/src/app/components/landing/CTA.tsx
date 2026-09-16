export default function CTA() {
  return (
    <section id="contact" className="px-6 py-24">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-black px-6 py-20 text-center text-white md:px-12">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-400">
            Get started
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-6xl">
            Your AI assistant
            <br />
            is ready.
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-gray-400">
            Chat, create, search and work with AI from one
            simple platform.
          </p>

          <div className="mt-9">
            <a
              href="/chat"
              className="inline-flex rounded-full bg-white px-7 py-3 font-medium text-black transition hover:bg-gray-200"
            >
              Start Chatting →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}