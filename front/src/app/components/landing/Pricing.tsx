const plans = [
  {
    name: "Free",
    price: "$0",
    description: "For trying out the AI platform.",
    features: [
      "Basic AI conversations",
      "Limited messages",
      "Chat history",
      "Basic models",
    ],
    button: "Get Started",
  },
  {
    name: "Pro",
    price: "$19",
    description: "For students, developers and professionals.",
    features: [
      "More AI messages",
      "Advanced AI models",
      "Document uploads",
      "Image generation",
      "Web search",
      "Priority access",
    ],
    button: "Start Pro",
    popular: true,
  },
  {
    name: "Business",
    price: "$49",
    description: "For teams building with AI.",
    features: [
      "Everything in Pro",
      "Higher usage limits",
      "Team workspace",
      "Advanced administration",
      "Priority support",
      "API access",
    ],
    button: "Choose Business",
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-gray-50 px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
            Pricing
          </p>

          <h2 className="mt-3 text-4xl font-bold md:text-5xl">
            Simple pricing
          </h2>

          <p className="mt-5 text-gray-600">
            Choose a plan that fits the way you use AI.
          </p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl border bg-white p-8 ${
                plan.popular
                  ? "border-black shadow-xl"
                  : "border-gray-200"
              }`}
            >
              {plan.popular && (
                <span className="absolute right-6 top-6 rounded-full bg-black px-3 py-1 text-xs text-white">
                  Popular
                </span>
              )}

              <h3 className="text-xl font-semibold">{plan.name}</h3>

              <p className="mt-3 text-sm text-gray-500">
                {plan.description}
              </p>

              <div className="mt-7">
                <span className="text-5xl font-bold">
                  {plan.price}
                </span>

                {plan.price !== "$0" && (
                  <span className="text-gray-500"> / month</span>
                )}
              </div>

              <button
                className={`mt-8 w-full rounded-full px-5 py-3 font-medium ${
                  plan.popular
                    ? "bg-black text-white"
                    : "border border-gray-300 bg-white"
                }`}
              >
                {plan.button}
              </button>

              <div className="mt-8 border-t pt-7">
                <p className="mb-4 text-sm font-semibold">
                  What included:
                </p>

                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex gap-3 text-sm text-gray-600"
                    >
                      <span className="text-black">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}