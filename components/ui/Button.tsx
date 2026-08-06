"use client";

import Link from "next/link";
import { type ReactNode, type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonBaseProps {
  variant?: Variant;
  size?: Size;
  full?: boolean;
  children: ReactNode;
  className?: string;
}

interface ButtonAsButton extends ButtonBaseProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> {
  href?: undefined;
}

interface ButtonAsLink extends ButtonBaseProps {
  href: string;
  target?: string;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-accent text-[#0f1115] shadow-[0_4px_20px_var(--accent-glow)] hover:bg-accent-hover hover:shadow-[0_6px_28px_var(--accent-glow)]",
  outline:
    "bg-transparent text-text-primary border-[1.5px] border-border-hover hover:border-accent hover:text-accent",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-5 py-2.5 text-sm min-h-[44px]",
  md: "px-7 py-3.5 text-[0.95rem] min-h-[44px]",
  lg: "px-8 py-4 text-[1.05rem] min-h-[44px]",
};

export default function Button({
  variant = "primary",
  size = "md",
  full = false,
  children,
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center gap-2 rounded-sm font-semibold cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] whitespace-nowrap hover:-translate-y-0.5 no-underline";

  const classes = `${base} ${variantStyles[variant]} ${sizeStyles[size]} ${
    full ? "w-full justify-center" : ""
  } ${className}`.trim();

  if ("href" in props && props.href !== undefined) {
    const { href, target, ...rest } = props as ButtonAsLink;
    return (
      <Link href={href} target={target} className={classes} {...rest}>
        {children}
      </Link>
    );
  }

  const buttonProps = props as ButtonAsButton;
  return (
    <button className={classes} {...buttonProps}>
      {children}
    </button>
  );
}
