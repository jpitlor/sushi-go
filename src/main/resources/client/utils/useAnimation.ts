import React, { useRef } from "react";

const ANIMATION_LENGTH = 1000;

export default function useAnimation(): [
  React.Ref<HTMLElement>,
  (string) => void
] {
  const ref = useRef<HTMLElement>(null);

  function animate(animation: string) {
    ref.current?.classList.add(animation);
    setTimeout(() => {
      ref.current?.classList.remove(animation);
    }, ANIMATION_LENGTH);
  }

  return [ref, animate];
}
