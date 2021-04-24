import { Skin } from "../../types/skins";
import chopsticks from "url:./chopsticks.png";
import dumpling from "url:./dumpling.png";
import eggNigiri from "url:./egg nigiri.png";
import maki from "url:./maki.png";
import pudding from "url:./pudding.png";
import salmonNigiri from "url:./salmon nigiri.png";
import sashimi from "url:./sashimi.png";
import squidNigiri from "url:./squid nigiri.png";
import tempura from "url:./tempura.png";
import wasabi from "url:./wasabi.png";

export default {
  chopsticks: {
    name: "Chopsticks",
    image: chopsticks,
    color: "#BDD4B5",
  },
  dumpling: {
    name: "Dumpling",
    image: dumpling,
    color: "#7F8DCF",
  },
  maki: {
    name: "Maki",
    image: maki,
    color: "#E23227",
  },
  nigiri: {
    name: "Nigiri",
  },
  nigiriEgg: {
    name: "Egg Nigiri",
    image: eggNigiri,
    color: "#F5D422",
  },
  nigiriSalmon: {
    name: "Salmon Nigiri",
    image: salmonNigiri,
    color: "#F5D422",
  },
  nigiriSquid: {
    name: "Squid Nigiri",
    image: squidNigiri,
    color: "#F5D422",
  },
  pudding: {
    name: "Pudding",
    image: pudding,
    color: "#FEAD80",
  },
  sashimi: {
    name: "Sashimi",
    image: sashimi,
    color: "#CFDB57",
  },
  tempura: {
    name: "Tempura",
    image: tempura,
    color: "#D4A7CD",
  },
  wasabi: {
    name: "Wasabi",
    image: wasabi,
    color: "#F1C927",
  },
} as Skin;
