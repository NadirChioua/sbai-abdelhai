import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import type { ComponentProps } from "react";

type Variant = "primary" | "outline" | "outline-light" | "ghost";
type Size = "md" | "lg";

/**
 * Pill buttons in the couture register (uppercase Jost, generous tracking).
 * `outline` is for light surfaces, `outline-light` for charcoal/video surfaces.
 */
const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-sans font-medium uppercase transition-colors duration-300 disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-gold text-gold-on hover:bg-gold-dark hover:text-ivory",
  outline:
    "border border-charcoal/40 text-foreground hover:border-gold hover:text-gold-dark",
  "outline-light":
    "border border-white/50 text-white hover:border-gold hover:text-gold",
  ghost: "text-foreground underline-offset-4 hover:text-gold-dark hover:underline",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-6 text-[11px] tracking-[0.14em]",
  lg: "h-13 px-8 py-4 text-xs tracking-[0.16em]",
};

function cls(variant: Variant, size: Size, className: string) {
  return `${base} ${variants[variant]} ${sizes[size]} ${className}`;
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return <button type={type} className={cls(variant, size, className)} {...props} />;
}

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: Variant;
  size?: Size;
  className?: string;
};

/** Internal (locale-aware) link styled as a button. */
export function ButtonLink({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonLinkProps) {
  return <Link className={cls(variant, size, className)} {...props} />;
}

type ButtonAnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
};

/** External link (tel:, wa.me, mailto:) styled as a button. */
export function ButtonAnchor({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonAnchorProps) {
  return (
    <a className={cls(variant, size, className)} {...props}>
      {children}
    </a>
  );
}
