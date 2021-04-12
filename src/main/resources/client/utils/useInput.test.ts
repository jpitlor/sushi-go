import { act, renderHook } from "@testing-library/react-hooks";
import useInput from "./useInput";
import wrapper from "./testWrapper";

describe("useInput", function () {
  it("has a default value", () => {
    const { result } = renderHook(() => useInput("hello, world"), { wrapper });

    expect(result.current[0]).toBe("hello, world");
  });

  it("doesn't change the default value", () => {
    let defaultValue = "hello, world";
    const { result, rerender } = renderHook(() => useInput(defaultValue), {
      wrapper,
    });

    defaultValue = "goodbye, world";
    rerender();

    expect(result.current[0]).toBe("hello, world");
  });

  it("changes value from an input event", () => {
    const { result } = renderHook(() => useInput("hello, world"), { wrapper });

    act(() => {
      // Type casted because an actual event has many more properties that aren't needed
      const event = { currentTarget: { value: "goodbye, world" } } as any;
      result.current[1](event);
    });

    expect(result.current[0]).toBe("goodbye, world");
  });

  it("changes value from a literal parameter", () => {
    const { result } = renderHook(() => useInput("hello, world" as string), {
      wrapper,
    });

    act(() => {
      result.current[1]("goodbye, world");
    });

    expect(result.current[0]).toBe("goodbye, world");
  });
});
