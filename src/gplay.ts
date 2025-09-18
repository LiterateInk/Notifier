// @ts-expect-error : the dts is badly done...
import gplay from "google-play-scraper";
import type { app as AppFn } from "google-play-scraper";

export const app = gplay.app as typeof AppFn;
