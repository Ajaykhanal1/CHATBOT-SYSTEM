export default function Footer() {
  return (
    <footer className="relative border-t border-white/5 px-6 py-12">
      <div className="absolute inset-x-0 top-0 -z-10 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 text-lg font-semibold">
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gradient-to-r from-primary to-accent">
                <span className="absolute inset-0 animate-ping rounded-full bg-primary/60" />
              </span>
              <span className="bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
                MyChat
              </span>
            </div>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              A modern AI chatbot platform built with Next.js, TypeScript and AI. One workspace for every leading model.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Product</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#features" className="transition-colors hover:text-foreground">
                  Features
                </a>
              </li>
              <li>
                <a href="#pricing" className="transition-colors hover:text-foreground">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#models" className="transition-colors hover:text-foreground">
                  Models
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Company</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#contact" className="transition-colors hover:text-foreground">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-foreground">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-foreground">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-foreground">
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-6 text-center text-sm text-muted-foreground sm:flex-row">
          <p>© 2026 MyChat. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="transition-colors hover:text-foreground">
              Privacy Policy
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              Terms of Service
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              Security
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}