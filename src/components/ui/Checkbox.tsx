import { memo } from "react";

export const Checkbox = memo(({ className = "", ...props }: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      type="checkbox"
      className={`ml-2 cursor-pointer ${className}`} {...props}
    />
  );
});

Checkbox.displayName = "Checkbox";
