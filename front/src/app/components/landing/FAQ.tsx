"use client";

import { useState } from "react";

const faqs = [
  {
    question: "What is MyChat?",
    answer:
      "MyChat is an all-in-one AI platform that gives you access to multiple leading AI models from a single, clean interface.",
  },
  {
    question: "Can I upload PDF documents?",
    answer:
      "Yes. You can upload PDFs and other documents to chat with them, summarize content, or ask specific questions.",
  },
  {
    question: "Can I use multiple AI models?",
    answer:
      "Absolutely. Switch between GPT, Claude, Gemini, DeepSeek and more without leaving your conversation.",
  },
  {
    question: "Is my chat history saved?",
    answer:
      "Yes. Your conversations are saved to your account so you can resume them anytime across devices.",
  },
  {
    question: "Can I use this on mobile?",
    answer:
      "Yes. MyChat is fully responsive and works great on phones, tablets and desktop.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="relative px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="text-center">
          <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-muted-foreground">
            FAQs
          </span>
          <h2 className="mt-6 text-balance text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            Frequently asked questions
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-balance text-lg text-muted-foreground">
            Everything you need to know about getting started with MyChat.
          </p>
        </div>

        <div className="mt-12 space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = open === index;
            return (
              <div
                key={faq.question}
                className={`overflow-hidden rounded-3xl border backdrop-blur transition-all ${
                  isOpen ? "border-white/20 bg-gradient-to-b from-white/10 to-white/5" : "border-white/10 bg-gradient-to-b from-white/10 to-white/5"
                }`}
              >
                <button
                  onClick={() => setOpen(isOpen ? null : index)}
                  className="flex w-full items-center justify-between gap-4 p-6 text-left"
                >
                  <span className="text-base font-medium">{faq.question}</span>
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-lg transition-transform group-open:rotate-45">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-sm text-muted-foreground">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}