import { useEffect } from "react";

export default function useAsyncEffect(
  callback: () => Promise<void>,
  deps: any[]
) {
  useEffect(() => {
    (async function doEffect() {
      await callback();
    })();
  }, deps);
}
