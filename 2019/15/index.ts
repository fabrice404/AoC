import { keyToPoint, pointToKey } from "../../helpers/helpers";
import AoCPuzzle from "../../puzzle";
import { Direction, Point } from "../../types";
import { IntCodeComputer } from "../int-code-computer";

const DIRECTIONS: Direction[] = ["U", "R", "D", "L"];

const MOVEMENT = {
  U: 1,
  D: 2,
  L: 3,
  R: 4,
};

interface Route {
  position: Point;
  steps: string[];
}

export default class Puzzle extends AoCPuzzle {
  private currentPosition: Point = { x: 0, y: 0 };

  private fullRoutes: Route[] = [];

  private map: Map<string, number> = new Map<string, number>();

  private maxX: number = 25;

  private maxY: number = 25;

  private minX: number = -25;

  private minY: number = -25;

  private queue: Route[] = [{ position: { x: 0, y: 0 }, steps: [] }];

  private expandOxygen() {
    const nextMap = new Map(this.map);
    for (const key of this.map.keys()) {
      const value = this.map.get(key);
      if (value === 2) {
        const { x, y } = keyToPoint(key);
        [
          [0, -1],
          [+1, 0],
          [0, +1],
          [-1, 0],
        ].forEach(([mx, my]) => {
          const newPoint = { x: x + mx, y: y + my };
          const newPointKey = pointToKey(newPoint);
          if (this.map.has(newPointKey)) {
            const newValue = this.map.get(newPointKey);
            if (newValue === 1) {
              nextMap.set(newPointKey, 2);
            }
          }
        });
      }
    }
    this.map = new Map(nextMap);
  }

  private isFullyWalled(): boolean {
    for (const key of this.map.keys()) {
      const { x, y } = keyToPoint(key);
      if (
        ![
          [0, -1],
          [+1, 0],
          [0, +1],
          [-1, 0],
        ]
          .map(([mx, my]) => {
            return this.map.has(pointToKey({ x: x + mx, y: y + my }));
          })
          .reduce((acc, val) => acc && val, true)
      ) {
        return false;
      }
    }
    return true;
  }

  private nextMove() {
    const { x, y } = this.currentPosition;

    return [
      [0, -1],
      [+1, 0],
      [0, +1],
      [-1, 0],
    ]
      .map(([mx, my], i) => {
        const position = { x: x + mx, y: y + my };
        const value = this.map.get(pointToKey(position)) ?? -1;
        if (value !== 0) {
          return {
            direction: DIRECTIONS[i],
            position,
            value,
          };
        }
        return;
      })
      .filter(Boolean)
      .sort((a, b) => (a!.value > b!.value ? Math.random() - 0.25 : Math.random() - 0.5))
      .find((x) => x)!;
  }

  private printMap(): void {
    // console.clear();
    // process.stdout.cursorTo(0, 0);
    for (let y = this.minY; y <= this.maxY; y += 1) {
      const row = [];
      for (let x = this.minX - 1; x <= this.maxX; x += 1) {
        const key = pointToKey({ x, y });
        let pixel = " ";
        if (this.map.has(key)) {
          switch (this.map.get(key)) {
            case 0:
              pixel = "█";
              break;
            case 1:
              pixel = "·";
              break;
            case 2:
              pixel = "@";
              break;
          }
        }
        if (this.currentPosition.x === x && this.currentPosition.y === y) {
          row.push(`\x1b[44m${pixel}\x1b[0m`);
        } else if (x === 0 && y === 0) {
          row.push(`\x1b[42m${pixel}\x1b[0m`);
        } else {
          row.push(pixel);
        }
      }
      console.log(row.join(""));
    }
  }

  private run() {
    const computer = new IntCodeComputer(this.input);

    let finished = false;
    while (!finished) {
      const nextMove = this.nextMove();

      computer.addInputs([MOVEMENT[nextMove.direction]]);
      finished = computer.compute();

      const output = computer.output!;

      this.map.set(pointToKey(nextMove.position), output);
      switch (output) {
        case 0:
          break;
        case 1:
          this.currentPosition = { ...nextMove.position };
          break;
        case 2:
          this.currentPosition = { ...nextMove.position };
          finished = true;
          break;
      }
      // this.minX = Math.min(this.minX, nextMove.position.x);
      // this.maxX = Math.max(this.maxX, nextMove.position.x);
      // this.minY = Math.min(this.minY, nextMove.position.y);
      // this.maxY = Math.max(this.maxY, nextMove.position.y);
    }
  }

  private step(route: Route): Route[] {
    return [
      [0, -1],
      [+1, 0],
      [0, +1],
      [-1, 0],
    ]
      .map(([mx, my]) => {
        const nextStep = { x: route.position.x + mx, y: route.position.y + my };
        const nextStepKey = pointToKey(nextStep);
        if (this.map.has(nextStepKey)) {
          if (route.steps.includes(nextStepKey)) {
            return;
          }
          const value = this.map.get(nextStepKey);
          const newRoute = {
            position: nextStep,
            steps: [...route.steps, nextStepKey],
          };
          if (value === 2) {
            this.fullRoutes.push(newRoute);
            return;
          }
          if (value === 1) {
            return newRoute;
          }
        }
        return;
      })
      .filter(Boolean) as Route[];
  }

  public async part1(): Promise<string | number> {
    this.map.set("0,0", 1);
    let i = 1;
    while (!this.isFullyWalled() && i < 30) {
      this.currentPosition = { x: 0, y: 0 };
      this.run();
      i += 1;
    }
    this.printMap();

    while (this.queue.length > 0) {
      const route = this.queue.shift()!;
      const routes = this.step(route);
      if (routes.length) {
        this.queue.push(...routes);
      }
    }

    return this.fullRoutes.sort((a, b) => (a.steps.length > b.steps.length ? 1 : -1))[0].steps.length;
  }

  public async part2(): Promise<string | number> {
    let i = 0;
    while ([...this.map.values()].includes(1)) {
      this.expandOxygen();
      i += 1;
    }
    return i;
  }
}
