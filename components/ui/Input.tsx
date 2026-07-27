"use client";

import {
  forwardRef,
  useId,
  type InputHTMLAttributes,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";

/**
 * Form primitives designed for React Hook Form (forwardRef + error prop).
 * Understated luxury: hairline borders, gold focus, no rounded corners.
 *
 * `tone` picks the surface the field sits on. It is a prop rather than a
 * className override because Tailwind resolves conflicting utilities by
 * stylesheet order, not by the order they appear in a class string.
 */
export type Tone = "light" | "dark";

const base =
  "w-full text-caption font-light px-4 focus:outline-none focus:border-gold aria-[invalid=true]:border-red-600";

const tones: Record<Tone, string> = {
  light: "border border-sand bg-white text-foreground placeholder:text-muted",
  dark: "border border-on-dark/25 bg-transparent text-white placeholder:text-on-dark/45",
};

const labelTones: Record<Tone, string> = {
  light: "text-secondary",
  dark: "text-on-dark-muted",
};

function FieldShell({
  id,
  label,
  error,
  tone,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  tone: Tone;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className={`eyebrow mb-2 block ${labelTones[tone]}`}>
        {label}
      </label>
      {children}
      {error && (
        <p
          role="alert"
          className={`mt-1.5 text-caption ${tone === "dark" ? "text-red-300" : "text-red-700"}`}
        >
          {error}
        </p>
      )}
    </div>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
  tone?: Tone;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, tone = "light", className = "", ...props },
  ref,
) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} error={error} tone={tone}>
      <input
        ref={ref}
        id={id}
        aria-invalid={error ? true : undefined}
        className={`h-12 ${base} ${tones[tone]} ${className}`}
        {...props}
      />
    </FieldShell>
  );
});

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
  tone?: Tone;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea(
    { label, error, tone = "light", className = "", rows = 5, ...props },
    ref,
  ) {
    const id = useId();
    return (
      <FieldShell id={id} label={label} error={error} tone={tone}>
        <textarea
          ref={ref}
          id={id}
          rows={rows}
          aria-invalid={error ? true : undefined}
          className={`py-3 ${base} ${tones[tone]} ${className}`}
          {...props}
        />
      </FieldShell>
    );
  },
);

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
  tone?: Tone;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    { label, error, tone = "light", className = "", children, ...props },
    ref,
  ) {
    const id = useId();
    return (
      <FieldShell id={id} label={label} error={error} tone={tone}>
        <select
          ref={ref}
          id={id}
          aria-invalid={error ? true : undefined}
          className={`h-12 appearance-none [&>option]:text-foreground ${base} ${tones[tone]} ${className}`}
          {...props}
        >
          {children}
        </select>
      </FieldShell>
    );
  },
);
