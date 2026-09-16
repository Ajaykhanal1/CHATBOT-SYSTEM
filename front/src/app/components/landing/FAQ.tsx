"use client";

import { useState } from "react";

const faqs = [
  {
    question: "What is this AI chatbot?",
    answer:
      "It is an AI platform where users can chat with AI models, upload documents, search the web and use other AI-powered features.",
  },
  {
    question: "Can I upload PDF documents?",
    answer:
      "Yes. Users can upload supported documents and ask questions based on the document content.",
  },
  {
    question: "Can I use multiple AI models?",
    answer:
      "Yes. The application can provide a model selector so users can choose between different AI models.",
  },
  {
    question: "Is my chat history saved?",
    answer:
      "Yes. Authenticated users can have their conversations stored and access them later.",
  },
  {
    question: "Can I use this on mobile?",
    answer:
      "Yes. The interface is designed to be responsive and can work on desktop, tablet and mobile devices.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
            FAQ
          </p>

          <h2 className="mt-3 text-4xl font-bold md:text-5xl">
            Frequently asked questions
          </h2>
        </div>

        <div className="mt-12 divide-y rounded-3xl border border-gray-200">
          {faqs.map((faq, index) => {
            const isOpen = open === index;

            return (
              <div key={faq.question} className="px-6">
                <button
                  onClick={() =>
                    setOpen(isOpen ? null : index)
                  }
                  className="flex w-full items-center justify-between py-6 text-left"
                >
                  <span className="font-medium">
                    {faq.question}
                  </span>

                  <span className="ml-4 text-xl">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <p className="pb-6 pr-8 leading-7 text-gray-500">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}