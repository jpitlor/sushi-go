import { Skin } from "../types/skins";
// This is a Parcel specific feature that lets us import everything in the directory
// @ts-ignore
import skins from "./*/cards";

export default skins as { [s: string]: Skin };
