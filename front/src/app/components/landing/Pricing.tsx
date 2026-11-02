const plans = [
  {
    name: "Free",
    price: "$0",
    period: "",
    description: "For trying out the platform.",
    features: ["Basic AI conversations", "Limited messages", "Chat history", "Basic models"],
    button: "Get Started",
    href: "/chat",
    popular: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/ month",
    description: "For students, developers and professionals.",
    features: ["More AI messages", "Advanced AI models", "Document uploads", "Image generation", "Web search", "Priority access"],
    button: "Start Pro",
    href: "/register",
    popular: true,
  },
  {
    name: "Business",
    price: "$49",
    period: "/ month",
    description: "For teams building with AI.",
    features: ["Everything in Pro", "Higher usage limits", "Team workspace", "Advanced administration", "Priority support", "API access"],
    button: "Choose Business",
    href: "/register",
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="relative px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto w-full max-w-[1200px]">
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

        <div className="mt-6 grid grid-cols-3 gap-2 sm:mt-12 sm:gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex h-full flex-col overflow-hidden rounded-2xl border backdrop-blur transition-all hover:-translate-y-1 sm:rounded-3xl ${
                plan.popular
                  ? "border-primary/60 bg-gradient-to-b from-primary/20 via-white/10 to-white/5 shadow-xl shadow-primary/20"
                  : "border-white/10 bg-gradient-to-b from-white/10 to-white/5"
              }`}
            >
              {plan.popular && (
                <div className="absolute right-2 top-2 rounded-full bg-gradient-to-r from-primary to-accent px-2 py-0.5 text-[8px] font-medium text-primary-foreground sm:right-6 sm:top-6 sm:px-3 sm:py-1 sm:text-xs">
                  Most popular
                </div>
              )}
              <div className="flex flex-1 flex-col p-3 sm:p-6 lg:p-8">
                <h3 className="text-sm font-semibold sm:text-lg">{plan.name}</h3>
                <p className="mt-1 text-[10px] leading-snug text-muted-foreground sm:mt-2 sm:text-sm">{plan.description}</p>
                <div className="mt-2 flex items-end gap-1 sm:mt-6 sm:gap-2">
                  <span className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">{plan.price}</span>
                  {plan.period && <span className="mb-0.5 text-[10px] text-muted-foreground sm:mb-2 sm:text-sm">{plan.period}</span>}
                </div>
                <a
                  href={plan.href || "/register"}
                  className={`mt-3 inline-flex w-full items-center justify-center rounded-full px-3 py-2 text-xs font-medium transition-all sm:mt-6 sm:px-6 sm:py-3 sm:text-sm lg:mt-8 ${
                    plan.popular
                      ? "bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-primary/40"
                      : "border border-white/10 bg-white/5 text-foreground hover:border-white/20 hover:bg-white/10"
                  }`}
                >
                  {plan.button}
                </a>
                <ul className="mt-3 flex flex-1 flex-col gap-1.5 text-[10px] text-muted-foreground sm:mt-6 sm:gap-2 sm:text-sm lg:mt-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-primary/80 to-accent/80 text-[8px] text-primary-foreground sm:h-5 sm:w-5 sm:text-[10px]">
                        ✓
                      </span>
                      <span className="leading-snug">{feature}</span>
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