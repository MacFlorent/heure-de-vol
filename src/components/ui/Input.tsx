import { memo } from "react";

export const Input = memo(({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      className={`mt-1 block w-full rounded-md border border-neutral-300 shadow-sm ${className}`} {...props}
    />
  );
});

Input.displayName = "Input";
