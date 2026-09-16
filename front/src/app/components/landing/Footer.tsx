const links = {
  Product: ["Features", "Pricing", "Models"],
  Company: ["About", "Contact", "Careers"],
  Legal: ["Privacy", "Terms", "Security"],
};

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <h2 className="text-xl font-bold">MyChat</h2>

            <p className="mt-4 max-w-xs text-sm leading-6 text-gray-500">
              A modern AI chatbot platform built with
              Next.js, TypeScript and AI.
            </p>
          </div>

          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <h3 className="font-semibold">{title}</h3>

              <ul className="mt-4 space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm text-gray-500 hover:text-black"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t pt-8 text-sm text-gray-500">
          © 2026 MyChat. All rights reserved.
        </div>
      </div>
    </footer>
  );
}