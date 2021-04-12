import { act, renderHook } from "@testing-library/react-hooks";
import useBoolean from "./useBoolean";
import wrapper from "./testWrapper";

describe("useBoolean", function () {
  it("has a default value", () => {
    const { result } = renderHook(() => useBoolean(true), { wrapper });

    expect(result.current[0]).toBe(true);
  });

  it("doesn't change its default value", () => {
    let defaultValue = true;
    const { result, rerender } = renderHook(() => useBoolean(defaultValue), {
      wrapper,
    });

    defaultValue = false;
    rerender();

    expect(result.current[0]).toBe(true);
  });

  it("changes values", () => {
    const { result } = renderHook(() => useBoolean(true), { wrapper });

    act(() => {
      result.current[2]();
    });
    expect(result.current[0]).toBe(false);

    act(() => {
      result.current[1]();
    });
    expect(result.current[0]).toBe(true);
  });
});
