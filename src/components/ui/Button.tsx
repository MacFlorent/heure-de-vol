import { memo } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:   "bg-primary-500 text-white hover:bg-primary-600",
  secondary: "bg-neutral-300 text-neutral-700 hover:bg-neutral-400",
  danger:    "bg-danger-600 text-white hover:bg-danger-700",
  ghost:     "text-primary-500 hover:text-primary-700",
};

export const Button = memo(({ variant = "primary", className = "", ...props }: ButtonProps) => {
  const classBase = (variant === "ghost")
    ? "transition-colors disabled:opacity-50"
    : "px-4 py-2 rounded transition-colors disabled:opacity-50";

    return (
    <button
      className={`${classBase} ${VARIANT_CLASSES[variant]} ${className}`} {...props}
    />
  );
});

Button.displayName = "Button";
