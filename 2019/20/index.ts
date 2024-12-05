import { alg, Graph } from "graphlib";

import { getUpRightLeftDownCoordinates } from "../../helpers/array";
import { pointToKey } from "../../helpers/helpers";
import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  private g: Graph = new Graph();

  public async part1(): Promise<string | number> {
    for (let y = 1; y < this.grid.length - 1; y += 1) {
      for (let x = 1; x < this.grid[0].length - 1; x += 1) {
        if (this.grid[y][x].match(/[A-Z]/)) {
          if (this.grid[y - 1][x] === ".") {
            this.grid[y][x] = this.grid[y][x] + this.grid[y + 1][x];
            this.grid[y + 1][x] = " ";
          }
          if (this.grid[y + 1][x] === ".") {
            this.grid[y][x] = this.grid[y - 1][x] + this.grid[y][x];
            this.grid[y - 1][x] = " ";
          }
          if (this.grid[y][x - 1] === ".") {
            this.grid[y][x] = this.grid[y][x] + this.grid[y][x + 1];
            this.grid[y][x + 1] = " ";
          }
          if (this.grid[y][x + 1] === ".") {
            this.grid[y][x] = this.grid[y][x - 1] + this.grid[y][x];
            this.grid[y][x - 1] = " ";
          }
        }
      }
    }

    this.getGridLoopXY().forEach((cell) => {
      const value = this.grid[cell.y][cell.x];
      if (value !== "#" && value != " ") {
        const key = value !== "." ? value : pointToKey(cell);
        this.g.setNode(key);

        getUpRightLeftDownCoordinates(cell)
          .filter((p) => this.isInGrid(p) && this.grid[p.y][p.x] !== "#" && this.grid[p.y][p.x] !== " ")
          .forEach((p) => {
            const pValue = this.grid[p.y][p.x];
            const pKey = pValue !== "." ? pValue : pointToKey(p);
            this.g.setNode(pKey);
            this.g.setEdge(key, pKey);
          });
      }
    });

    const dijkstra = alg.dijkstra(this.g, "AA", (e) => (e.v === "AA" || e.w.match(/[A-Z]/gi) ? 0 : 1));

    return dijkstra["ZZ"].distance;
  }

  public async part2(): Promise<string | number> {
    return "<NOT YET IMPLEMENTED>";
  }
}
