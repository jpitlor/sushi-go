import React, { useRef } from "react";

export default function useAnimation(): [
  React.Ref<HTMLElement>,
  (string) => void
] {
  const ref = useRef<HTMLElement>(null);

  function animate(animation: string) {
    const classes = ["animate__animated", "animate__" + animation];
    ref.current?.classList.add(...classes);
    ref.current?.addEventListener(
      "animationend",
      () => ref.current?.classList.remove(...classes),
      { once: true }
    );
  }

  return [ref, animate];
}
