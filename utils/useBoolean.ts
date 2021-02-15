import { useState } from "react";

export default function useBoolean(
  defaultValue: boolean
): [boolean, () => void, () => void] {
  const [state, setState] = useState(defaultValue);

  function setTrue() {
    setState(true);
  }

  function setFalse() {
    setState(false);
  }

  return [state, setTrue, setFalse];
}
