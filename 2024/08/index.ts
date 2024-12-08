import { pointToKey } from "../../helpers/helpers";
import AoCPuzzle from "../../puzzle";
import { Point } from "../../types";

interface Antenna {
  value: string;
  location: Point;
}

export default class Puzzle extends AoCPuzzle {
  private antennas: Antenna[] = [];

  private antinodes: Map<string, string[]> = new Map();

  private values: Set<string> = new Set();

  public async part1(): Promise<string | number> {
    this.getGridLoopXY().forEach(({ x, y }) => {
      const value = this.grid[y][x];
      if (value !== ".") {
        this.antennas.push({ value, location: { x, y } });
        this.values.add(value);
      }
    });

    this.values.forEach((value) => {
      this.antennas.forEach((a1) => {
        this.antennas
          .filter((a2) => a2.value === a1.value && pointToKey(a2.location) !== pointToKey(a1.location))
          .forEach((a2) => {
            const dx = Math.abs(a1.location.x - a2.location.x);
            const dy = Math.abs(a1.location.y - a2.location.y);

            const x = a1.location.x > a2.location.x ? a1.location.x + dx : a1.location.x - dx;
            const y = a1.location.y > a2.location.y ? a1.location.y + dy : a1.location.y - dy;
            const p = { x, y };

            if (this.isInGrid(p)) {
              const key1 = pointToKey(p);
              this.antinodes.set(key1, [...(this.antinodes.get(key1) || []), value]);
              if (this.grid[y][x] === ".") {
                this.grid[y][x] = "#";
              }
            }
          });
      });
    });

    return this.antinodes.size;
  }

  public async part2(): Promise<string | number> {
    this.antennas.forEach((a1) => {
      this.antennas
        .filter((a2) => a2.value === a1.value && pointToKey(a2.location) !== pointToKey(a1.location))
        .forEach((a2) => {
          let multiplier = 1;
          while (multiplier !== 0) {
            const dx = multiplier * Math.abs(a1.location.x - a2.location.x);
            const dy = multiplier * Math.abs(a1.location.y - a2.location.y);

            const x = a1.location.x > a2.location.x ? a1.location.x + dx : a1.location.x - dx;
            const y = a1.location.y > a2.location.y ? a1.location.y + dy : a1.location.y - dy;
            const p = { x, y };

            if (this.isInGrid(p)) {
              const key1 = pointToKey(p);
              this.antinodes.set(key1, [...new Set([...(this.antinodes.get(key1) || []), a1.value])]);
              if (this.grid[y][x] === ".") {
                this.grid[y][x] = "#";
              }
              multiplier += 1;
            } else {
              multiplier = -1;
            }
          }
        });
    });

    return this.antinodes.size;
  }
}
