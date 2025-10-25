import { memo, useCallback } from "react";

import { FormField } from "@/types/form";

export interface FieldProps {
  stateField: FormField;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Field = memo(({ stateField, onBlur, onChange }: FieldProps) => {
  const commonWrapper = useCallback((inputElement: React.ReactElement<HTMLInputElement>) => (
    <div>
        <label className="block text-sm font-medium mb-1">
          {stateField.label}:
          {inputElement}
        </label>
        {stateField.touched && stateField.error && (<p className="text-red-500 text-sm mt-1">{stateField.error}</p>)}
      </div>
  ), [stateField.label, stateField.touched, stateField.error]);

  if (stateField.type === "checkbox") {
    return commonWrapper(
      <input
        type="checkbox"
        name={stateField.name}
        checked={Boolean(stateField.value)}
        onChange={onChange}
        onBlur={onBlur}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
      />
    );
  }
  else {
    return commonWrapper(
      <input
        type={stateField.type}
        name={stateField.name}
        value={String(stateField.value)}
        onChange={onChange}
        onBlur={onBlur}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
    />
    );
  }
});

Field.displayName = "Field";
