import { getNeighborsCoordinates } from "../../helpers/array";
import AoCPuzzle from "../../puzzle";
import { Point } from "../../types";
import { keyToPoint, pointToKey } from "../../helpers/helpers";

export default class Puzzle extends AoCPuzzle {
  private map: string[][][] = [];

  private positions: Point[] = [];

  private copyMapAndEmpty() {
    return JSON.parse(
      JSON.stringify(this.map.map((row, y) => row.map((cell, x) => (x === 0 || y === 0 || x === this.map[y].length - 1 || y === this.map.length - 1 ? cell : [])))),
    );
  }

  private initMap() {
    this.map = this.grid.map((row) => row.map((cell) => (cell === "." ? [] : [cell])));
    this.positions = [{ x: 1, y: 0 }];
  }

  private nextMinute() {
    const newMap = this.copyMapAndEmpty();
    this.getGridLoopXY()
      .filter(({ x, y }) => x > 0 && y > 0 && y < this.grid.length - 1 && x < this.grid[y].length - 1)
      .forEach(({ x, y }) => {
        while (this.map[y][x].length > 0) {
          const value = this.map[y][x].shift()!;
          let newX = value === ">" ? x + 1 : value === "<" ? x - 1 : x;
          let newY = value === "v" ? y + 1 : value === "^" ? y - 1 : y;

          if (newY === 0) {
            newY = this.map.length - 2;
          } else if (newY === this.map.length - 1) {
            newY = 1;
          }

          if (newX === 0) {
            newX = this.map[newY].length - 2;
          } else if (newX === this.map[newY].length - 1) {
            newX = 1;
          }
          newMap[newY][newX].push(value);
        }
      });
    this.map = newMap;

    const potentialPositions: Set<string> = new Set();
    while (this.positions.length > 0) {
      const position = this.positions.shift()!;
      for (const dest of [position, ...getNeighborsCoordinates(position)]) {
        if (this.isInGrid({ x: dest.x, y: dest.y }) && this.map[dest.y][dest.x].length === 0) {
          potentialPositions.add(pointToKey({ x: dest.x, y: dest.y }));
        }
      }
    }
    this.positions.push(...[...new Set(potentialPositions)].map((k) => keyToPoint(k)));
  }

  public async part1(): Promise<string | number> {
    this.initMap();

    let escaped = false;
    let minute = 0;

    while (!escaped) {
      this.nextMinute();
      minute += 1;

      escaped = this.positions.some((p) => p.x === this.grid[0].length - 2 && p.y === this.grid.length - 1);
    }
    return minute;
  }

  public async part2(): Promise<string | number> {
    this.setInput(this.input);
    this.initMap();
    let minute = 0;

    let escaped = false;
    while (!escaped) {
      this.nextMinute();
      minute += 1;

      escaped = this.positions.some((p) => p.x === this.grid[0].length - 2 && p.y === this.grid.length - 1);
    }

    escaped = false;
    this.positions = [{ x: this.grid[0].length - 2, y: this.grid.length - 1 }];
    while (!escaped) {
      this.nextMinute();
      minute += 1;

      escaped = this.positions.some((p) => p.x === 1 && p.y === 0);
    }

    escaped = false;
    this.positions = [{ x: 1, y: 0 }];
    while (!escaped) {
      this.nextMinute();
      minute += 1;

      escaped = this.positions.some((p) => p.x === this.grid[0].length - 2 && p.y === this.grid.length - 1);
    }

    return minute;
  }
}
