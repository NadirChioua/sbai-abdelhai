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
 */
const fieldClass =
  "w-full border border-sand bg-white px-4 text-sm font-light text-foreground placeholder:text-muted focus:border-gold focus:outline-none aria-[invalid=true]:border-red-700";

function FieldShell({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="micro-label mb-2 block text-secondary">
        {label}
      </label>
      {children}
      {error && (
        <p role="alert" className="mt-1.5 text-xs text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, className = "", ...props },
  ref,
) {
  const id = useId();
  return (
    <FieldShell id={id} label={label} error={error}>
      <input
        ref={ref}
        id={id}
        aria-invalid={error ? true : undefined}
        className={`h-12 ${fieldClass} ${className}`}
        {...props}
      />
    </FieldShell>
  );
});

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  error?: string;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ label, error, className = "", rows = 5, ...props }, ref) {
    const id = useId();
    return (
      <FieldShell id={id} label={label} error={error}>
        <textarea
          ref={ref}
          id={id}
          rows={rows}
          aria-invalid={error ? true : undefined}
          className={`py-3 ${fieldClass} ${className}`}
          {...props}
        />
      </FieldShell>
    );
  },
);

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  error?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select({ label, error, className = "", children, ...props }, ref) {
    const id = useId();
    return (
      <FieldShell id={id} label={label} error={error}>
        <select
          ref={ref}
          id={id}
          aria-invalid={error ? true : undefined}
          className={`h-12 appearance-none ${fieldClass} ${className}`}
          {...props}
        >
          {children}
        </select>
      </FieldShell>
    );
  },
);
