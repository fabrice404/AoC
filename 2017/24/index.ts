import { sortNumeric, sum } from "../../helpers/array";
import { pointToKey } from "../../helpers/helpers";
import AoCPuzzle from "../../puzzle";
import { Point } from "../../types";

interface QueueItem {
  pin: number;
  visited: string[];
}

export default class Puzzle extends AoCPuzzle {
  private bridges: string[][] = [];
  public async part1(): Promise<string | number> {
    const components: Point[] = this.lines.map((line) => {
      const [x, y] = line.split("/").map(Number);
      return { x, y };
    });

    const queue: QueueItem[] = [{ pin: 0, visited: ["0,0"] }];

    while (queue.length > 0) {
      const next = queue.pop()!;
      const comps = components.filter((c) => !next.visited.includes(pointToKey(c)) && [c.x, c.y].includes(next.pin));

      if (comps.length === 0) {
        this.bridges.push(next.visited);
      } else {
        comps.forEach((c) => {
          const pin = c.x === next.pin ? c.y : c.x;
          queue.push({ pin, visited: [...next.visited, pointToKey(c)] });
        });
      }
    }

    return this.bridges
      .map((b) => sum(b.join(",").split(",").map(Number)))
      .sort(sortNumeric)
      .pop()!;
  }

  public async part2(): Promise<string | number> {
    let maxLen = 0;
    for (const b of this.bridges) {
      maxLen = Math.max(maxLen, b.length);
    }

    return this.bridges
      .filter((b) => b.length === maxLen)
      .map((b) => sum(b.join(",").split(",").map(Number)))
      .sort(sortNumeric)
      .pop()!;
  }
}
