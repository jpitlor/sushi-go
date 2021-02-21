import { useState, FormEvent } from "react";

export default function useInput<T extends string>(
  defaultValue: T
): [T, (e: FormEvent<HTMLInputElement> | T) => void] {
  const [state, setState] = useState(defaultValue);

  function onChange(e: FormEvent<HTMLInputElement> | T) {
    if (typeof e === "object") {
      setState(e.currentTarget.value as T);
    } else {
      setState(e);
    }
  }

  return [state, onChange];
}
