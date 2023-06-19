import { minAllowedHeight, minAllowedWidth } from "application/lib/constants";
import { atom } from "jotai";

export const global = {
  inIframe: atom<boolean>(false),
  windowWidth: atom<number>(minAllowedWidth),
  windowHeight: atom<number>(minAllowedHeight),
  meme: atom<{
    title: string;
    imageUrl: string;
  } | null>(null),
};
