import { getNeighborsCoordinates } from "../../helpers/array";
import { DIRECTIONS, pointToKey } from "../../helpers/helpers";
import AoCPuzzle from "../../puzzle";
import { Direction, Point } from "../../types";

interface QueueItem {
  p: Point;
  d: Direction;
  visited: string[];
  score: number;
}

interface Path {
  visited: string[];
  score: number;
}

export default class Puzzle extends AoCPuzzle {
  private fullPaths: Path[] = [];

  private minScore: number = Number.MAX_SAFE_INTEGER;

  public async part1(): Promise<string | number> {
    let start: Point = { x: 0, y: 0 };

    this.getGridLoopXY().forEach((p) => {
      if (this.getValue(p) === "S") {
        start = p;
      }
    });

    const queue: QueueItem[] = [{ p: start, d: "R", visited: [], score: 0 }];
    const seen: Map<string, number> = new Map();

    while (queue.length > 0) {
      const current = queue.shift()!;

      if (this.getValue(current.p) === "E") {
        if (current.score < this.minScore) {
          this.minScore = Math.min(this.minScore, current.score);
        }
        this.fullPaths.push({ visited: current.visited, score: current.score });
        continue;
      }

      const key = `${pointToKey(current.p)},${current.d}`;
      if (seen.has(key) && seen.get(key)! < current.score) {
        continue;
      } else {
        seen.set(key, current.score);
      }
      if (current.score > this.minScore) {
        continue;
      }

      const neighbors = getNeighborsCoordinates(current.p)
        .map((p, i) => ({ p, d: DIRECTIONS[i] }))
        .filter((n) => !current.visited.includes(pointToKey(n.p)));

      for (const neighbor of neighbors) {
        const value = this.getValue(neighbor.p);
        if (value !== "#") {
          const score = current.score + (current.d === neighbor.d ? 1 : 1001);
          const visited = [...current.visited, pointToKey(current.p)];
          queue.push({ ...neighbor, visited, score });
        }
      }
    }

    return this.minScore;
  }

  public async part2(): Promise<string | number> {
    const keys = new Set(
      this.fullPaths
        .filter((p) => p.score === this.minScore)
        .map((p) => p.visited)
        .flat(2),
    );
    return keys.size + 1;
  }
}
