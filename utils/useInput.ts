import { useState, FormEvent } from "react";

export default function useInput(
  defaultValue: string
): [string, (e: FormEvent<HTMLInputElement> | string) => void] {
  const [state, setState] = useState(defaultValue);

  function onChange(e: FormEvent<HTMLInputElement> | string) {
    if (typeof e === "string") {
      setState(e);
    } else {
      setState(e.currentTarget.value);
    }
  }

  return [state, onChange];
}
