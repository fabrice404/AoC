import { alg, Graph } from "@dagrejs/graphlib";
import { create2DArray, getNeighborsCoordinates } from "../../helpers/array";
import { pointToKey } from "../../helpers/helpers";
import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  private g: Graph = new Graph();

  private target: string = "";

  private run(n: number) {
    const size = this.isExample ? 6 : 70;
    const bytes = this.lines.slice(0, n);
    this.target = `${size},${size}`;

    this.grid = create2DArray(size + 1, size + 1, "");

    for (let y = 0; y <= size; y += 1) {
      for (let x = 0; x <= size; x += 1) {
        const key = pointToKey({ x, y });
        const neighbors = getNeighborsCoordinates({ x, y });
        if (!bytes.includes(key)) {
          this.grid[y][x] = ".";
          this.g.setNode(key);
          for (const neighbor of neighbors) {
            const nKey = pointToKey(neighbor);
            if (this.isInGrid(neighbor) && !bytes.includes(nKey)) {
              this.g.setNode(nKey);
              this.g.setEdge(key, nKey);
            }
          }
        }
      }
    }

    const dijkstra = alg.dijkstra(this.g, "0,0");
    return dijkstra[this.target].distance;
  }

  public async part1(): Promise<string | number> {
    return this.run(this.isExample ? 12 : 1024);
  }

  public async part2(): Promise<string | number> {
    const remaining = this.lines.slice(this.isExample ? 12 : 1024);
    while (remaining.length) {
      const current = remaining.shift()!;
      this.g.removeNode(current);
      const dijkstra = alg.dijkstra(this.g, "0,0");
      if (!Number.isFinite(dijkstra[this.target].distance)) {
        return current;
      }
    }

    return "<NOT YET IMPLEMENTED>";
  }
}
