import { getNeighborsCoordinates } from "../../helpers/array";
import { pointToKey } from "../../helpers/helpers";
import AoCPuzzle from "../../puzzle";
import { Point } from "../../types";

export default class Puzzle extends AoCPuzzle {
  private totalTrails: number = 0;

  private followTrail(point: Point, value: number) {
    return getNeighborsCoordinates(point)
      .map(({ x, y }) => {
        if (this.isInGrid({ x, y }) && +this.grid[y][x] === value + 1) {
          return { point: { x, y }, value: value + 1 };
        }
      })
      .filter(Boolean);
  }

  public async part1(): Promise<string | number> {
    const result: Set<string> = new Set();
    this.getGridLoopXY().forEach(({ x, y }) => {
      if (+this.grid[y][x] === 0) {
        const queue: any[] = [{ point: { x, y }, value: 0 }];
        while (queue.length > 0) {
          const next = queue.shift()!;
          if (next.value === 9) {
            result.add(`${pointToKey({ x, y })}>${pointToKey(next.point)}`);
            this.totalTrails += 1;
          } else {
            queue.push(...this.followTrail(next.point, next.value));
          }
        }
      }
    });

    return result.size;
  }

  public async part2(): Promise<string | number> {
    return this.totalTrails;
  }
}
