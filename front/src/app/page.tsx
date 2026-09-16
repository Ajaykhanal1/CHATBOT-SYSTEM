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
    <main className="min-h-screen bg-white text-black">
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