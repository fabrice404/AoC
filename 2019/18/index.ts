import { alg, Graph } from "@dagrejs/graphlib";

import { getUpRightLeftDownCoordinates } from "../../helpers/array";
import { pointToKey } from "../../helpers/helpers";
import AoCPuzzle from "../../puzzle";

interface Dijkstra {
  [key: string]: Route;
}

interface Route {
  distance: number;
  predecessor: string;
}

export default class Puzzle extends AoCPuzzle {
  private g: Graph = new Graph();

  private letters: Set<string> = new Set<string>("@");

  private routes: any[] = [];

  private shortestRoute = Number.MAX_SAFE_INTEGER;

  private findRoute(to: string, from: string, dijkstra: Dijkstra) {
    const doors = [];

    let current = to;
    while (current !== from) {
      current = dijkstra[current].predecessor;
      if (!current.includes(",") && !current.includes("@") && current == current.toUpperCase()) {
        doors.push(current);
      }
    }
    return doors;
  }

  private goto(currentPosition: string, currentDistance: number, steps: string[]): any[] {
    if (currentDistance >= this.shortestRoute) {
      return [];
    }

    if (steps.length === this.letters.size - 1) {
      if (currentDistance < this.shortestRoute) {
        console.log(`New shortest route found ${currentDistance} ${[...steps, currentPosition].join(">")}`);
        this.shortestRoute = Math.min(this.shortestRoute, currentDistance);
      }
      return [];
    }

    const response: any[] = [];
    const routes = this.routes.filter((r) => r.from === currentPosition);
    for (const route of routes) {
      if (!steps.includes(route.to)) {
        const noDoors = route.doors.every((door: string) => steps.includes(door.toLowerCase()));
        if (noDoors) {
          response.push([route.to, currentDistance + route.distance, [...steps, route.from]]);
        }
      }
    }
    return response;
  }

  public async part1(): Promise<string | number> {
    console.log("building graph");
    this.getGridLoopXY().forEach((cell) => {
      const value = this.grid[cell.y][cell.x];
      if (value !== "#") {
        const key = value !== "." ? value : pointToKey(cell);
        this.g.setNode(key);

        if (key.match(/[a-z]/g)) {
          this.letters.add(key);
        }

        getUpRightLeftDownCoordinates(cell)
          .filter((p) => this.isInGrid(p) && this.grid[p.y][p.x] !== "#")
          .forEach((p) => {
            const pValue = this.grid[p.y][p.x];
            const pKey = pValue !== "." ? pValue : pointToKey(p);
            this.g.setNode(pKey);
            this.g.setEdge(key, pKey);
          });
      }
    });

    console.log("calculating paths");
    const dijkstraAll = alg.dijkstraAll(this.g);

    for (const [from, destinations] of Object.entries(dijkstraAll).filter(([key]) => !key.includes(","))) {
      for (const [to, { distance }] of Object.entries(destinations).filter(([key]) => !key.includes(","))) {
        if (from !== to && to === to.toLowerCase()) {
          const doors = this.findRoute(to, from, destinations);
          this.routes.push({ from, to, doors, distance });
        }
      }
    }

    console.log("finding shortest path");
    const queue: any[] = [["@", 0, []]];

    while (queue.length > 0) {
      const [pos, dis, steps] = queue.pop();
      const nextSteps = this.goto(pos, dis, steps);
      if (nextSteps.length > 0) {
        queue.push(...nextSteps);
      }
    }

    return this.shortestRoute;
  }

  public async part2(): Promise<string | number> {
    return "<NOT YET IMPLEMENTED>";
  }
}
