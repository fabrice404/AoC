import { addUniqueItem } from "../../helpers/array";
import AoCPuzzle from "../../puzzle";

interface Galaxy {
  id: number;
  x: number;
  y: number;
}

export default class Puzzle extends AoCPuzzle {
  private columnsWithGalaxy: number[] = [];

  private columnsWithoutGalaxy: number[] = [];

  private expansion: number = 2;

  private galaxies: Galaxy[] = [];

  private rowsWithGalaxy: number[] = [];

  private rowsWithoutGalaxy: number[] = [];

  private totalDistance: number = 0;

  private calculateDistances(): void {
    this.totalDistance = 0;
    let totalPairs = 0;
    for (let i = 0; i < this.galaxies.length; i += 1) {
      const galaxyA = this.galaxies[i];
      for (let j = i + 1; j < this.galaxies.length; j += 1) {
        const galaxyB = this.galaxies[j];
        let distance: number = Math.abs(galaxyB.x - galaxyA.x) + Math.abs(galaxyB.y - galaxyA.y);

        totalPairs += 1;
        for (let x = Math.min(galaxyA.x, galaxyB.x); x < Math.max(galaxyA.x, galaxyB.x); x += 1) {
          if (this.columnsWithoutGalaxy.includes(x)) {
            distance += this.expansion - 1;
          }
        }
        for (let y = Math.min(galaxyA.y, galaxyB.y); y < Math.max(galaxyA.y, galaxyB.y); y += 1) {
          if (this.rowsWithoutGalaxy.includes(y)) {
            distance += this.expansion - 1;
          }
        }

        this.totalDistance += distance;
      }
    }

    if (totalPairs !== (this.galaxies.length * (this.galaxies.length - 1)) / 2) {
      throw new Error("Pairs count is wrong");
    }
  }

  private expandUniverse(): void {
    this.rowsWithoutGalaxy = Array(this.grid.length)
      .fill(0)
      .map((_, i) => i)
      .filter((i) => !this.rowsWithGalaxy.includes(i));

    this.rowsWithoutGalaxy.forEach((y) => {
      this.grid[y].forEach((cell, x) => {
        this.grid[y][x] = "█";
      });
    });

    this.columnsWithoutGalaxy = Array(this.grid[0].length)
      .fill(0)
      .map((_, i) => i)
      .filter((i) => !this.columnsWithGalaxy.includes(i));

    this.columnsWithoutGalaxy.forEach((x) => {
      this.grid.forEach((row, y) => {
        this.grid[y][x] = "█";
      });
    });

    let galaxyId = 0;
    this.grid.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === "#") {
          this.galaxies.push({ x, y, id: galaxyId });
          galaxyId += 1;
        }
      });
    });
  }

  public async part1(): Promise<string | number> {
    this.grid = this.lines.map((line, y) =>
      line.split("").map((char, x) => {
        if (char === "#") {
          addUniqueItem(this.rowsWithGalaxy, y);
          addUniqueItem(this.columnsWithGalaxy, x);
        }
        return char;
      }),
    );

    this.expandUniverse();
    // print2d(this.grid);

    this.expansion = 2;
    this.calculateDistances();
    return this.totalDistance;
  }

  public async part2(): Promise<string | number> {
    this.expansion = this.galaxies.length === 9 ? 10 : 1000000;
    this.calculateDistances();
    return this.totalDistance;
  }
}
