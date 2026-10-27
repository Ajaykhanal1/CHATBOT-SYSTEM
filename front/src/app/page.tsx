import Navbar from "./components/landing/Navbar";
import Hero from "./components/landing/Hero";
import Models from "./components/landing/Models";
import Features from "./components/landing/Features";
import Pricing from "./components/landing/Pricing";
import FAQ from "./components/landing/FAQ";
import CTA from "./components/landing/CTA";
import Footer from "./components/landing/Footer";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[880px] bg-noise" />
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[880px] bg-grid opacity-40" />
      <Navbar />
      <Hero />
      <Models />
      <Features />
      <Pricing />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}