import { create2DArray, getNeighborsCoordinates } from "../../helpers/array";
import AoCPuzzle from "../../puzzle";
import { Point } from "../../types";
import { manhattanDistance } from "../../helpers/numbers";

export default class Puzzle extends AoCPuzzle {
  private distances: number[][] = [];

  private end: Point = { x: -1, y: 1 };

  private calculateAllDistancesToEnd() {
    this.distances = create2DArray(this.grid.length, this.grid[0].length, -1);

    const queue = [{ ...this.end, distance: 0 }];
    while (queue.length) {
      const next = queue.shift()!;
      const neighbors = getNeighborsCoordinates({ ...next });
      for (const neighbor of neighbors) {
        if (this.isInGrid(neighbor) && this.getValue(neighbor) !== "#") {
          if (this.distances[neighbor.y][neighbor.x] === -1) {
            const distance = next.distance + 1;
            this.distances[neighbor.y][neighbor.x] = distance;
            queue.push({ ...neighbor, distance });
          }
        } else {
          this.distances[neighbor.y][neighbor.x] = Infinity;
        }
      }
    }

    this.distances.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === -1) {
          this.distances[y][x] = Infinity;
        }
      });
    });
  }

  private cheat(cheatDuration: number): number {
    this.locateStartAndEnd();
    this.calculateAllDistancesToEnd();
    let count = 0;

    this.getGridLoopXY().forEach((p) => {
      if (this.distances[p.y][p.x] === Infinity) {
        return;
      }

      for (let y = p.y - cheatDuration; y <= p.y + cheatDuration; y += 1) {
        for (let x = p.x - cheatDuration; x <= p.x + cheatDuration; x += 1) {
          if (!this.isInGrid({ x, y }) || this.distances[y][x] === Infinity || (x === p.x && y === p.y)) {
            continue;
          }

          const cheated = manhattanDistance(p, { x, y });
          if (cheated > cheatDuration) {
            continue;
          }

          const uncheated = this.distances[p.y][p.x] - this.distances[y][x];
          const totalDistance = uncheated - cheated;
          if (totalDistance < (this.isExample ? 50 : 100)) {
            continue;
          }

          count += 1;
        }
      }
    });

    return count;
  }

  private locateStartAndEnd() {
    this.getGridLoopXY().forEach((p) => {
      if (this.getValue(p) === "E") {
        this.end = p;
      }
    });
  }

  public async part1(): Promise<string | number> {
    return this.cheat(2);
  }

  public async part2(): Promise<string | number> {
    return this.cheat(20);
  }
}
