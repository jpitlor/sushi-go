import { Skin } from "../types/skins";
import { store } from "../data/store";
import skins from "../skins";

export function _s(key: keyof Skin): string {
  const { skin } = store.getState();
  return skins[skin][key].name;
}

export function _i(key: keyof Skin): string {
  const { skin } = store.getState();
  return skins[skin][key].image;
}
