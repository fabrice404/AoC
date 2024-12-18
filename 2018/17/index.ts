import { getAllNeighborsCoordinates } from "../../helpers/array";
import { ConsoleColor, keyToPoint, pointToKey, waitSync } from "../../helpers/helpers";
import AoCPuzzle from "../../puzzle";
import { Point } from "../../types";

export default class Puzzle extends AoCPuzzle {
  private addWater(p: Point, s: string) {
    if (p.y === this.grid.length - 1) {
      console.log("BORDEL DE MERDE!!! ", p, s);
      this.highlightCell(p, ConsoleColor.Red);
    }
    this.setValue(p, s);
    this.highlightCell(p, ConsoleColor.Cyan);
    if (this.isExample) {
      this.printGrid();
      waitSync(50);
    }
  }

  private findFallingWater(): Point[] {
    for (let y = this.grid.length - 2; y >= 0; y -= 1) {
      const falls = this.grid[y].map((s, x) => (s === "|" ? { x, y } : null)).filter(Boolean) as Point[];
      if (falls.length) {
        return falls;
      }
    }
    return [];
  }

  public async part1(): Promise<string | number> {
    const clay: string[] = [];

    let minX = Number.MAX_SAFE_INTEGER;
    let maxX = 0;
    let maxY = 0;

    for (const line of this.lines) {
      const [a, b, c] = line
        .replace(/[^0-9,.]/gi, "")
        .split(/\.|,/gi)
        .filter(Boolean)
        .map(Number);

      for (let i = b; i <= c; i += 1) {
        if (line[0] === "x") {
          clay.push(pointToKey({ x: a, y: i }));
          minX = Math.min(minX, a);
          maxX = Math.max(maxX, a);
        } else {
          clay.push(pointToKey({ x: i, y: a }));
          maxY = Math.max(maxY, a);
        }
      }
    }
    const offset = minX - 1;

    this.grid = Array.from({ length: maxY + 1 }, () => Array.from({ length: maxX - minX + 3 }, () => "."));

    clay.forEach((k) => {
      const { x, y } = keyToPoint(k);
      this.setValue({ x: x - offset, y }, "#");
    });

    const water = { x: 500 - offset, y: 0 };
    this.addWater(water, "|");

    const queue = [water];
    let end = false;

    while (queue.length > 0) {
      const current = queue.pop()!;
      const currentValue = this.getValue(current);
      const [, , , pW, pE, pSW, pS, pSE] = getAllNeighborsCoordinates(current);

      if (this.isInGrid(pS)) {
        const vE = this.getValue(pE);
        const vSE = this.getValue(pSE);
        const vS = this.getValue(pS);
        const vSW = this.getValue(pSW);
        const vW = this.getValue(pW);

        if (currentValue === "|") {
          if (vS === ".") {
            this.addWater(pS, "|");
            queue.push(pS);
          } else if (vS === "#" || vS === "~") {
            this.addWater(current, "~");
            queue.unshift(current);
          }
        }

        if (currentValue === "~") {
          if (vW === ".") {
            if (vSW === ".") {
              this.addWater(pW, "|");
              queue.unshift(pW);
            } else {
              this.addWater(pW, "~");
              queue.push(pW);
            }
          }

          if (vE === ".") {
            if (vSE === ".") {
              this.addWater(pE, "|");
              queue.unshift(pE);
            } else {
              this.addWater(pE, "~");
              queue.push(pE);
            }
          }
        }
      } else {
        end = true;
      }

      if (queue.length === 0) {
        if (!end) {
          queue.unshift(...this.findFallingWater());
        }
        if (end) {
          let falls = this.findFallingWater();
          while (falls.length && queue.length === 0) {
            falls.forEach((p) => {
              this.highlightCell(p, ConsoleColor.Red);

              let isLeftOpen = true;
              let isRightOpen = true;

              const bottom = { x: p.x, y: p.y + 1 };
              if (this.getValue({ x: p.x, y: p.y + 1 }) === "~") {
                let goLeft = true;
                let l = 1;
                while (goLeft) {
                  const val = this.getValue({ x: bottom.x - l, y: bottom.y });
                  goLeft = val === "~";
                  if (val === "#") {
                    isLeftOpen = false;
                  }
                  l += 1;
                }

                let goRight = true;
                let r = 1;
                while (goRight) {
                  const val = this.getValue({ x: bottom.x + r, y: bottom.y });
                  goRight = val === "~";
                  if (val === "#") {
                    isRightOpen = false;
                  }
                  r += 1;
                }
              }

              if (!isLeftOpen && !isRightOpen) {
                this.addWater(p, "~");
                queue.push(p);
              } else {
                this.addWater(p, "x");
              }
            });
            falls = this.findFallingWater();
          }
        }
      }
    }

    this.printGrid();
    return this.grid.flat(2).filter((s) => s !== "." && s !== "#").length - 1;
  }

  public async part2(): Promise<string | number> {
    return "<NOT YET IMPLEMENTED>";
  }
}
