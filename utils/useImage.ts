import { useSelector } from "../data/store";
import skins from "../skins";
import { Skin } from "../types/skins";

export default function useImage(card: keyof Skin) {
  const skin = useSelector((state) => state.settings.skin);

  return skins[skin][card].image;
}
