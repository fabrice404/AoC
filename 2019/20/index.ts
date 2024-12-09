import { alg, Graph } from "@dagrejs/graphlib";

import { getUpRightLeftDownCoordinates } from "../../helpers/array";
import { pointToKey } from "../../helpers/helpers";
import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  private g: Graph = new Graph();

  private fixLetters(grid: any[][], levelOut: number = 0, levelIn: number = 0): any[][] {
    for (let y = 1; y < this.grid.length - 1; y += 1) {
      for (let x = 1; x < this.grid[0].length - 1; x += 1) {
        if (grid[y][x].match(/[A-Z]/)) {
          const level = x < 2 || x > grid[0].length - 3 || y < 2 || y > grid.length - 3 ? levelOut : levelIn;

          if (grid[y - 1][x] === ".") {
            grid[y][x] = (grid[y][x] + this.grid[y + 1][x]).trim() + this.levelName(level);
            grid[y + 1][x] = " ";
          }
          if (grid[y + 1][x] === ".") {
            grid[y][x] = (grid[y - 1][x] + grid[y][x]).trim() + this.levelName(level);
            grid[y - 1][x] = " ";
          }
          if (grid[y][x - 1] === ".") {
            grid[y][x] = (grid[y][x] + grid[y][x + 1]).trim() + this.levelName(level);
            grid[y][x + 1] = " ";
          }
          if (this.grid[y][x + 1] === ".") {
            grid[y][x] = (grid[y][x - 1] + grid[y][x]).trim() + this.levelName(level);
            grid[y][x - 1] = " ";
          }
        }
      }
    }
    return grid;
  }

  private levelName(level: number) {
    return level === 0 ? "" : level.toString();
  }

  private populateGraph(grid: any[][], level: number = 0) {
    for (let y = 1; y < grid.length - 1; y += 1) {
      for (let x = 1; x < grid[0].length - 1; x += 1) {
        const value = grid[y][x];
        if (value !== "#" && value != " ") {
          const key = value !== "." ? value : `${pointToKey({ x, y })},${level}`;
          this.g.setNode(key);

          getUpRightLeftDownCoordinates({ x, y })
            .filter((p) => this.isInGrid(p) && grid[p.y][p.x] !== "#" && grid[p.y][p.x] !== " ")
            .forEach((p) => {
              const pValue = grid[p.y][p.x];
              const pKey = pValue !== "." ? pValue : `${pointToKey(p)},${level}`;
              this.g.setNode(pKey);
              this.g.setEdge(key, pKey);
            });
        }
      }
    }
  }

  public async part1(): Promise<string | number> {
    this.grid = this.fixLetters(this.grid, 0);
    this.populateGraph(this.grid);

    const dijkstra = alg.dijkstra(this.g, "AA", (e) => (e.v === "AA" || e.w.match(/[A-Z]/gi) ? 0 : 1));

    return dijkstra["ZZ"].distance;
  }

  public async part2(): Promise<string | number> {
    this.g = new Graph();
    let level = 0;
    let result: number;

    do {
      // console.log(`Calculating level ${level}`);
      const grid = this.fixLetters(JSON.parse(JSON.stringify(this.grid)), level, level + 1);
      this.populateGraph(grid, level);

      const dijkstra = alg.dijkstra(this.g, "AA", (e) => (e.v === "AA" || e.w.match(/[A-Z]/gi) ? 0 : 1));
      result = dijkstra.ZZ.distance;
      level += 1;
    } while (result === Infinity);

    return result;
  }
}
