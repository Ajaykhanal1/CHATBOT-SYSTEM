const plans = [
  {
    name: "Free",
    price: "$0",
    period: "",
    description: "For trying out the platform.",
    features: ["Basic AI conversations", "Limited messages", "Chat history", "Basic models"],
    button: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/ month",
    description: "For students, developers and professionals.",
    features: ["More AI messages", "Advanced AI models", "Document uploads", "Image generation", "Web search", "Priority access"],
    button: "Start Pro",
    popular: true,
  },
  {
    name: "Business",
    price: "$49",
    period: "/ month",
    description: "For teams building with AI.",
    features: ["Everything in Pro", "Higher usage limits", "Team workspace", "Advanced administration", "Priority support", "API access"],
    button: "Choose Business",
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="text-center">
          <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-muted-foreground">
            Simple, transparent pricing
          </span>
          <h2 className="mt-6 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Choose the plan that fits you
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-lg text-muted-foreground">
            Start free, upgrade when you need more power and capacity.
          </p>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative overflow-hidden rounded-3xl border backdrop-blur transition-all hover:-translate-y-1 ${
                plan.popular
                  ? "border-primary/60 bg-gradient-to-b from-primary/20 via-white/10 to-white/5 shadow-xl shadow-primary/20"
                  : "border-white/10 bg-gradient-to-b from-white/10 to-white/5"
              }`}
            >
              {plan.popular && (
                <div className="absolute right-6 top-6 rounded-full bg-gradient-to-r from-primary to-accent px-3 py-1 text-xs font-medium text-primary-foreground">
                  Most popular
                </div>
              )}
              <div className="p-8">
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
                <div className="mt-6 flex items-end gap-2">
                  <span className="text-5xl font-semibold tracking-tight">{plan.price}</span>
                  {plan.period && <span className="mb-2 text-sm text-muted-foreground">{plan.period}</span>}
                </div>
                <a
                  href="/register"
                  className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-6 py-3 text-sm font-medium transition-all ${
                    plan.popular
                      ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40"
                      : "border border-white/10 bg-white/5 text-foreground hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  {plan.button}
                </a>
                <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-primary/80 to-accent/80 text-[10px] text-primary-foreground">
                        ✓
                      </span>
                      <span>{feature}</span>
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