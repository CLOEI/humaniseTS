import type { GhostCursor } from "ghost-cursor";

declare module "humanisets" {
  interface humanise {
    humanise(selector: import("puppeteer").Browser): Promise<Boolean>;
  }
}

declare module "puppeteer" {
  interface Page {
    humanType(
      selector: string,
      text: string,
      cursor: import("ghost-cursor").GhostCursor
    ): Promise<void>;
  }
}
