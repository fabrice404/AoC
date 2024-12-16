import { alg, Graph } from "@dagrejs/graphlib";
import { getUpRightLeftDownCoordinates } from "../../helpers/array";
import { pointToKey } from "../../helpers/helpers";
import AoCPuzzle from "../../puzzle";

interface Path {
  letter: string;
  visited: string[];
  score: number;
}

export default class Puzzle extends AoCPuzzle {
  private g: Graph = new Graph();

  private letters: string[] = [];

  private paths: Path[] = [];

  private populateGraph(grid: any[][], level: number = 0) {
    for (let y = 1; y < grid.length - 1; y += 1) {
      for (let x = 1; x < grid[0].length - 1; x += 1) {
        const value = this.getValue({ x, y });
        if (value !== "#" && value != " ") {
          const key = value !== "." ? `L${value}` : `${pointToKey({ x, y })},${level}`;
          this.g.setNode(key);
          if (value !== ".") {
            this.letters.push(key);
          }

          getUpRightLeftDownCoordinates({ x, y })
            .filter((p) => this.isInGrid(p) && grid[p.y][p.x] !== "#" && grid[p.y][p.x] !== " ")
            .forEach((p) => {
              const pValue = grid[p.y][p.x];
              const pKey = pValue !== "." ? `L${pValue}` : `${pointToKey(p)},${level}`;
              this.g.setNode(pKey);
              this.g.setEdge(key, pKey);
            });
        }
      }
    }
  }

  public async part1(): Promise<string | number> {
    this.populateGraph(this.grid);

    const dijkstra = alg.dijkstraAll(this.g);

    const queue: Path[] = [{ letter: "L0", visited: ["L0"], score: 0 }];

    let minScore = Number.MAX_SAFE_INTEGER;

    while (queue.length) {
      const current = queue.shift()!;

      if (current.visited.length === this.letters.length) {
        minScore = Math.min(minScore, current.score);
        this.paths.push({ ...current });
      }

      if (current.score > minScore) {
        continue;
      }

      this.letters.forEach((letter) => {
        if (!current.visited.includes(letter)) {
          const d = dijkstra[current.letter][letter];
          if (d) {
            queue.push({ letter, visited: [...current.visited, letter], score: current.score + d.distance });
          }
        }
      });
    }

    this.paths.forEach((path) => {
      const d = dijkstra[path.letter]["L0"];
      if (d) {
        path.score = path.score + d.distance;
        path.visited = [...path.visited, "L0"];
      } else {
        path.score = 0;
      }
    });

    return minScore;
  }

  public async part2(): Promise<string | number> {
    return this.paths.sort((a, b) => (a.score > b.score ? 1 : -1))[0].score;
  }
}
