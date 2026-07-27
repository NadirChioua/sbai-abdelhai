"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import RevealOnScroll from "@/components/motion/RevealOnScroll";

export type FaqItem = { question: string; answer: string };

/** Accordion FAQ — native <button> + aria-expanded, one panel open at a time. */
export default function FAQ({
  label,
  title,
  items,
  className = "bg-ivory",
}: {
  label: string;
  title: string;
  items: FaqItem[];
  className?: string;
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className={className}>
      <div className="mx-auto max-w-screen-2xl px-4 py-24 md:px-8 md:py-28">
        <div className="grid gap-10 lg:grid-cols-3">
          <RevealOnScroll>
            <p className="eyebrow text-gold-dark">{label}</p>
            <h2 className="heading-display mt-3 text-h2 text-foreground">
              {title}
            </h2>
          </RevealOnScroll>

          <dl className="lg:col-span-2">
            {items.map((item, i) => {
              const isOpen = open === i;
              return (
                <div key={item.question} className="border-b border-sand">
                  <dt>
                    <button
                      type="button"
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      aria-controls={`faq-panel-${i}`}
                      id={`faq-trigger-${i}`}
                      className="flex w-full items-start justify-between gap-6 py-6 text-start transition-colors hover:text-gold-dark"
                    >
                      <span className="font-display text-body-lg">
                        {item.question}
                      </span>
                      <Plus
                        size={20}
                        aria-hidden
                        className={`mt-1 shrink-0 text-gold-dark transition-transform duration-300 ${
                          isOpen ? "rotate-45" : ""
                        }`}
                      />
                    </button>
                  </dt>
                  <dd
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-trigger-${i}`}
                    hidden={!isOpen}
                    className="pb-6 pe-10 text-body font-light text-secondary"
                  >
                    {item.answer}
                  </dd>
                </div>
              );
            })}
          </dl>
        </div>
      </div>
    </section>
  );
}
