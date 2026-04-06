import { memo } from "react";

interface FieldsetProps {
  legend: string;
  children: React.ReactNode;
}

export const Fieldset = memo(({ legend, children }: FieldsetProps) => {
  return (
    <fieldset className="border border-neutral-200 rounded p-4">
      <legend className="text-sm font-medium text-neutral-700 px-1">{legend}</legend>
      {children}
    </fieldset>
  );
});

Fieldset.displayName = "Fieldset";
