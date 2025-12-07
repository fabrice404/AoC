import { memoize } from "../../helpers/memoize";
import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  public async part1(): Promise<string | number> {
    const beams = new Set<number>();
    let splits = 0;

    for (const line of this.lines) {
      const cols = line.split("");

      for (let i = 0; i < cols.length; i++) {
        const col = cols[i];
        if (col === "S") {
          beams.add(i);
        } else if (col === "^" && beams.has(i)) {
          beams.add(i - 1);
          beams.add(i + 1);
          beams.delete(i);
          splits += 1;
        }
      }
    }
    return splits;
  }

  public async part2(): Promise<string | number> {
    const getTimeLine = memoize((lineIndex: number, colIndex: number): number => {
      if (lineIndex === this.grid.length) {
        return 1;
      }

      const cell = this.grid[lineIndex][colIndex];

      if (cell === "S" || cell === "|") {
        if (lineIndex < this.grid.length) {
          if (this.isInGrid({ x: colIndex, y: lineIndex + 1 }) && this.getValue({ x: colIndex, y: lineIndex + 1 }) === ".") {
            this.setValue({ x: colIndex, y: lineIndex + 1 }, "|");
          }
        }
        return getTimeLine(lineIndex + 1, colIndex);
      } else if (cell === "^") {
        if (lineIndex < this.grid.length) {
          if (this.isInGrid({ x: colIndex + 1, y: lineIndex + 1 }) && this.getValue({ x: colIndex + 1, y: lineIndex + 1 }) === ".") {
            this.setValue({ x: colIndex + 1, y: lineIndex + 1 }, "|");
          }

          if (this.isInGrid({ x: colIndex - 1, y: lineIndex + 1 }) && this.getValue({ x: colIndex - 1, y: lineIndex + 1 }) === ".") {
            this.setValue({ x: colIndex - 1, y: lineIndex + 1 }, "|");
          }
        }

        const leftTimelines = getTimeLine(lineIndex + 1, colIndex - 1);
        const rightTimelines = getTimeLine(lineIndex + 1, colIndex + 1);
        return leftTimelines + rightTimelines;
      } else {
        return -1;
      }
    });

    return getTimeLine(0, this.grid[0].indexOf("S"));
  }
}
