import { getUpRightLeftDownCoordinates, sum } from "../../helpers/array";
import { DIRECTIONS, pointToKey } from "../../helpers/helpers";
import AoCPuzzle from "../../puzzle";
import { Direction, Point, Step } from "../../types";
import { IntCodeComputer } from "../int-code-computer";

export default class Puzzle extends AoCPuzzle {
  private actions: string[] = [];

  private currentDirection: Direction = "U";

  private currentPosition: Point = { x: 0, y: 0 };

  private steps: string[] = [];

  private compress() {
    this.actions = this.actions.join("").replace(/RRR/gi, "L").split("");
    const tmp: string[] = [];
    let steps = 0;
    while (this.actions.length > 0) {
      const action = this.actions.shift()!;
      if (action === "1") {
        steps += 1;
      } else {
        if (steps > 0) {
          tmp.push(`${steps}`);
        }
        steps = 0;
        tmp.push(action);
      }
    }
    if (steps > 0) {
      tmp.push(`${steps}`);
    }
    this.actions = tmp;

    for (let i = 0; i < 20; i += 1) {
      for (let j = 0; j < 20; j += 1) {
        for (let k = 0; k < 20; k += 1) {
          const matches: { [key: string]: string } = {};
          let remaining = this.actions.join(",");
          matches.A = remaining.slice(0, i);
          remaining = remaining.replace(new RegExp(`${matches.A},?`, "gi"), "");
          matches.B = remaining.slice(0, j);
          remaining = remaining.replace(new RegExp(`${matches.B},?`, "gi"), "");
          matches.C = remaining.slice(0, k);
          remaining = remaining.replace(new RegExp(`${matches.C},?`, "gi"), "");
          if (!remaining) {
            let compressed = this.actions.join(",");
            Object.entries(matches).forEach(([key, val]) => {
              compressed = compressed.replace(new RegExp(val, "gi"), key);
            });
            return { compressed, matches };
          }
        }
      }
    }
  }

  private encode(s: string): number[] {
    return s.split("").map((c) => c.charCodeAt(0));
  }

  private findNextMove(): Step | undefined {
    this.steps.push(pointToKey(this.currentPosition));
    this.grid[this.currentPosition.y][this.currentPosition.x] = "█";

    const around = getUpRightLeftDownCoordinates(this.currentPosition)
      .map((p, i) => ({ point: p, direction: DIRECTIONS[i] }))
      .filter((p) => !this.steps.slice(-5).includes(pointToKey(p.point)))
      .filter((p) => this.grid[p.point.y] && (this.grid[p.point.y][p.point.x] === "#" || this.grid[p.point.y][p.point.x] === "█"));
    if (around.length === 0) {
      return;
    }

    let nextPoint: Step | undefined;
    if (around.length === 1) {
      [nextPoint] = around;
    } else {
      nextPoint = around.find((p) => p.direction === this.currentDirection)!;
    }

    if (nextPoint) {
      while (nextPoint.direction !== this.currentDirection) {
        this.actions.push("R");
        this.currentDirection = DIRECTIONS[(DIRECTIONS.indexOf(this.currentDirection) + 1) % 4];
      }
      this.actions.push("1");
      this.currentPosition = nextPoint.point;
    }

    // this.printGrid();
    return nextPoint;
  }

  public async part1(): Promise<string | number> {
    const computer = new IntCodeComputer(this.input);
    this.grid = [];

    let row = [];
    let finished = false;
    while (!finished) {
      finished = computer.compute(false);
      switch (computer.output) {
        case 10:
          this.grid.push(row);
          row = [];
          break;
        case 35:
          row.push("#");
          break;
        case 46:
          row.push(" ");
          break;
        default:
          this.currentPosition = { x: row.length, y: this.grid.length };
          const c = String.fromCharCode(computer.output!);
          switch (c) {
            case "^":
              this.currentDirection = "U";
              break;
            case ">":
              this.currentDirection = "R";
              break;
            case "v":
              this.currentDirection = "D";
              break;
            case "<":
              this.currentDirection = "L";
              break;
          }

          row.push(String.fromCharCode(computer.output!));
          break;
      }
    }

    const intersections: Point[] = [];
    for (let y = 1; y < this.grid.length - 2; y += 1) {
      for (let x = 1; x < this.grid[y].length; x += 1) {
        if (this.grid[y][x] === "#" && getUpRightLeftDownCoordinates({ x, y }).every((p) => this.grid[p.y][p.x] === "#")) {
          intersections.push({ x, y });
        }
      }
    }

    // this.printGrid();
    return sum(intersections.map((p) => p.x * p.y));
  }

  public async part2(): Promise<string | number> {
    while (this.findNextMove());

    const { compressed, matches } = this.compress()!;

    const inputs = [compressed, matches.A, matches.B, matches.C, "y"].map((s) => [...this.encode(s), 10]).flat();

    const computer = new IntCodeComputer(`2${this.input.slice(1)}`, inputs);

    let finished = false;
    while (!finished) {
      finished = computer.compute(false);
      if (!finished) {
        // process.stdout.write(String.fromCharCode(computer.output));
      }
    }
    console.log({ output: computer.output });

    return computer.output!;
    // return this.run(`2${this.input.slice(1)}`, inputs);
  }
}
