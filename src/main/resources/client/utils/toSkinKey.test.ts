import { Card, Maki, Nigiri, Wasabi } from "../types/props";
import { renderHook } from "@testing-library/react-hooks";
import useHelpText from "./cardHelpText";
import wrapper from "./testWrapper";
import toSkinKey from "./toSkinKey";

describe("To Skin Key", function () {
  it("Nigiri: 1pt", () => {
    const card = { id: "", type: "nigiri", value: 1 } as Nigiri;
    const result = toSkinKey(card);

    expect(result).toBe("nigiriEgg");
  });

  it("Nigiri: 2pts", () => {
    const card = { id: "", type: "nigiri", value: 2 } as Nigiri;
    const result = toSkinKey(card);

    expect(result).toBe("nigiriSalmon");
  });

  it("Nigiri: 3pts", () => {
    const card = { id: "", type: "nigiri", value: 3 } as Nigiri;
    const result = toSkinKey(card);

    expect(result).toBe("nigiriSquid");
  });

  it("Maki", () => {
    const card = { id: "", type: "maki", count: 1 } as Maki;
    const result = toSkinKey(card);

    expect(result).toBe("maki");
  });

  it("Sashimi", () => {
    const card = { id: "", type: "sashimi" } as Card;
    const result = toSkinKey(card);

    expect(result).toBe("sashimi");
  });

  it("Tempura", () => {
    const card = { id: "", type: "tempura" } as Card;
    const result = toSkinKey(card);

    expect(result).toBe("tempura");
  });

  it("Chopsticks", () => {
    const card = { id: "", type: "chopsticks" } as Card;
    const result = toSkinKey(card);

    expect(result).toBe("chopsticks");
  });

  it("Dumpling", () => {
    const card = { id: "", type: "dumpling" } as Card;
    const result = toSkinKey(card);

    expect(result).toBe("dumpling");
  });

  it("Pudding", () => {
    const card = { id: "", type: "pudding" } as Card;
    const result = toSkinKey(card);

    expect(result).toBe("pudding");
  });

  it("Wasabi", () => {
    const card = { id: "", type: "wasabi", nigiri: null } as Wasabi;
    const result = toSkinKey(card);

    expect(result).toBe("wasabi");
  });
});
