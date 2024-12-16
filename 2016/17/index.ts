import { md5 } from "../../helpers/string";
import AoCPuzzle from "../../puzzle";
import { Point } from "../../types";

interface Path extends Point {
  distance: number;
  hash: string;
}

export default class Puzzle extends AoCPuzzle {
  private fullPaths: Path[] = [];

  public async part1(): Promise<string | number> {
    this.grid = Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => "."));

    let minDistance = Number.MAX_VALUE;
    const queue = [{ x: 0, y: 0, distance: 0, hash: this.input }];

    while (queue.length) {
      const next = queue.shift()!;

      if (next.x === 3 && next.y === 3) {
        minDistance = Math.min(minDistance, next.distance);
        this.fullPaths.push(next);
        continue;
      }

      const newHash = md5(next.hash);

      if (newHash[0].match(/[bcdef]/gi)) {
        const p = { x: next.x, y: next.y - 1 };
        if (this.isInGrid(p)) {
          queue.push({ ...p, distance: next.distance + 1, hash: `${next.hash}U` });
        }
      }
      if (newHash[1].match(/[bcdef]/gi)) {
        const p = { x: next.x, y: next.y + 1 };
        if (this.isInGrid(p)) {
          queue.push({ ...p, distance: next.distance + 1, hash: `${next.hash}D` });
        }
      }

      if (newHash[2].match(/[bcdef]/gi)) {
        const p = { x: next.x - 1, y: next.y };
        if (this.isInGrid(p)) {
          queue.push({ ...p, distance: next.distance + 1, hash: `${next.hash}L` });
        }
      }

      if (newHash[3].match(/[bcdef]/gi)) {
        const p = { x: next.x + 1, y: next.y };
        if (this.isInGrid(p)) {
          queue.push({ ...p, distance: next.distance + 1, hash: `${next.hash}R` });
        }
      }
    }

    return this.fullPaths
      .sort((a, b) => (a.distance > b.distance ? 1 : -1))
      .shift()!
      .hash.replace(this.input, "");
  }

  public async part2(): Promise<string | number> {
    return this.fullPaths.sort((a, b) => (a.distance > b.distance ? 1 : -1)).pop()!.distance;
  }
}
