import { useSelector } from "../data/store";
import skins from "../skins";
import { Skin } from "../types/skins";

export default function useString(card: keyof Skin) {
  const skin = useSelector((state) => state.skin);

  return skins[skin][card].name;
}
