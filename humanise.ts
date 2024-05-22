import { Browser } from "puppeteer";
import { createCursor } from "ghost-cursor";

function sleep(s: number) {
  return new Promise((resolve) => setTimeout(resolve, s * 1000));
}

export default async function humanise(browser: Browser) {
  browser.on("targetcreated", async (target) => {
    if (target.type() === "page") {
      const page = await target.page();

      if (page && !page.humanType) {
        page.humanType = async function (
          selector,
          text,
          cursor = createCursor(page)
        ) {
          const adjacentKeys: { [char: string]: string[] } = {
            a: ["q", "s", "z"],
            b: ["v", "g", "n"],
            c: ["x", "d", "f", "v"],
            d: ["e", "r", "f", "c", "x", "s"],
            e: ["w", "r", "d", "s"],
            f: ["r", "t", "g", "v", "c", "d"],
            g: ["t", "y", "h", "b", "v", "f"],
            h: ["y", "u", "j", "n", "b", "g"],
            i: ["u", "o", "j", "k"],
            j: ["u", "i", "k", "m", "n", "h"],
            k: ["i", "o", "l", "j", "m"],
            l: ["o", "p", "k", ";"],
            m: ["n", "j", "k", ","],
            n: ["b", "h", "j", "m"],
            o: ["i", "p", "k", "l"],
            p: ["o", "l", "["],
            q: ["w", "a", "1"],
            r: ["e", "t", "f", "d", "4"],
            s: ["a", "w", "e", "d", "x", "z"],
            t: ["r", "y", "g", "f", "5"],
            u: ["y", "i", "j", "h", "7"],
            v: ["c", "f", "g", "b"],
            w: ["q", "a", "s", "e", "2"],
            x: ["z", "s", "d", "c"],
            y: ["t", "u", "h", "g", "6"],
            z: ["a", "s", "x"],
            "1": ["2", "q"],
            "2": ["1", "3", "w", "q"],
            "3": ["2", "4", "e", "w"],
            "4": ["3", "5", "r", "e"],
            "5": ["4", "6", "t", "r"],
            "6": ["5", "7", "y", "t"],
            "7": ["6", "8", "u", "y"],
            "8": ["7", "9", "i", "u"],
            "9": ["8", "0", "o", "i"],
            "0": ["9", "p", "o", "-"],
            "-": ["0", "p", "[", "="],
            "=": ["-", "[", "]"],
            "[": ["p", "l", "="],
            "]": ["[", "="],
            ";": ["l", "'", ","],
            "'": [";", ",", "."],
            ",": ["m", "k", "'"],
            ".": [",", "l", ";"],
          };

          const makeMistake = () => Math.random() * 100 <= 35;
          const delay = 0.5;

          const element = await page.waitForSelector(selector);
          if (element) {
            await element.scrollIntoView();
            await cursor.move(selector);
            await cursor.click(selector);

            for (const char of text) {
              if (makeMistake() && adjacentKeys[char]) {
                const randomAdjacentKey =
                  adjacentKeys[char][
                    Math.floor(Math.random() * adjacentKeys[char].length)
                  ];
                await page.keyboard.type(randomAdjacentKey);
                await sleep(Math.random() * delay + 0.15);
                await page.keyboard.press("Backspace");
                await sleep(Math.random() * delay);
                await page.keyboard.type(char);
              } else {
                await page.keyboard.type(char);
              }
              await sleep(Math.random() * delay);
            }
          }
        };
      }
    }
  });
}
