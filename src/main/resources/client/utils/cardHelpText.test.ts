import { renderHook } from "@testing-library/react-hooks";
import useHelpText from "./cardHelpText";
import wrapper from "./testWrapper";
import { Card, Maki, Nigiri, Wasabi } from "../types/props";

describe("Card Help Text", () => {
  it("Nigiri: 1pt", () => {
    const card = { id: "", type: "nigiri", value: 1 } as Nigiri;
    const { result } = renderHook(() => useHelpText(card), { wrapper });

    expect(result.current).toBe("Nigiri: Worth 1 point");
  });

  it("Nigiri: 2pts", () => {
    const card = { id: "", type: "nigiri", value: 2 } as Nigiri;
    const { result } = renderHook(() => useHelpText(card), { wrapper });

    expect(result.current).toBe("Nigiri: Worth 2 points");
  });

  it("Nigiri: 3pts", () => {
    const card = { id: "", type: "nigiri", value: 3 } as Nigiri;
    const { result } = renderHook(() => useHelpText(card), { wrapper });

    expect(result.current).toBe("Nigiri: Worth 3 points");
  });

  it("Maki", () => {
    const card = { id: "", type: "maki", count: 1 } as Maki;
    const { result } = renderHook(() => useHelpText(card), { wrapper });

    expect(result.current).toBe(
      "Maki: Top 2 Maki collectors at the end of the round win points"
    );
  });

  it("Sashimi", () => {
    const card = { id: "", type: "sashimi" } as Card;
    const { result } = renderHook(() => useHelpText(card), { wrapper });

    expect(result.current).toBe(
      "Sashimi: A set of 3 earns 10 points. Incomplete sets earn 0 points"
    );
  });

  it("Tempura", () => {
    const card = { id: "", type: "tempura" } as Card;
    const { result } = renderHook(() => useHelpText(card), { wrapper });

    expect(result.current).toBe(
      "Tempura: A set of 2 earns 5 points. Incomplete sets earn 0 points"
    );
  });

  it("Chopsticks", () => {
    const card = { id: "", type: "chopsticks" } as Card;
    const { result } = renderHook(() => useHelpText(card), { wrapper });

    expect(result.current).toBe(
      "Chopsticks: Lets you play a second card from a future hand"
    );
  });

  it("Dumpling", () => {
    const card = { id: "", type: "dumpling" } as Card;
    const { result } = renderHook(() => useHelpText(card), { wrapper });

    expect(result.current).toBe(
      "Dumpling: Worth different values depending on how big the set is. 1 = 1; 2 = 3; 3 = 6; 4 = 10; >=5 = 15"
    );
  });

  it("Pudding", () => {
    const card = { id: "", type: "pudding" } as Card;
    const { result } = renderHook(() => useHelpText(card), { wrapper });

    expect(result.current).toBe(
      "Pudding: Top pudding collectors at the end of the game earn points. Bottom pudding collectors lose points."
    );
  });

  it("Wasabi", () => {
    const card = { id: "", type: "wasabi", nigiri: null } as Wasabi;
    const { result } = renderHook(() => useHelpText(card), { wrapper });

    expect(result.current).toBe("Wasabi: Next Nigiri worth triple");
  });
});
