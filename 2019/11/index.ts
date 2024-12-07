import { pointToKey } from "../../helpers/helpers";
import AoCPuzzle from "../../puzzle";
import { Direction, Point } from "../../types";
import { IntCodeComputer } from "../int-code-computer";

const BLACK = 0;
const WHITE = 1;

const DIRECTIONS: Direction[] = ["U", "R", "D", "L"];

export default class Puzzle extends AoCPuzzle {
  private hull: { [key: string]: number } = {};

  private maxX: number = Number.MIN_SAFE_INTEGER;

  private maxY: number = Number.MIN_SAFE_INTEGER;

  private minX: number = Number.MAX_SAFE_INTEGER;

  private minY: number = Number.MAX_SAFE_INTEGER;

  private move(location: Point, direction: Direction): Point {
    switch (direction) {
      case "U":
        location.y -= 1;
        break;
      case "D":
        location.y += 1;
        break;
      case "L":
        location.x -= 1;
        break;
      case "R":
        location.x += 1;
        break;
    }
    return location;
  }

  private print(initialColor: number) {
    const computer = new IntCodeComputer(this.input);

    computer.addInputs([initialColor]);

    let directionIndex: number = 0;

    let location: Point = { x: 0, y: 0 };

    let finished = false;
    while (!finished) {
      finished = computer.compute(false);
      this.hull[pointToKey(location)] = computer.output!;

      finished = computer.compute(false);
      directionIndex = (directionIndex + (computer.output === 0 ? -1 : 1) + 4) % 4;
      location = this.move(location, DIRECTIONS[directionIndex]);
      this.minX = Math.min(this.minX, location.x);
      this.maxX = Math.max(this.maxX, location.x);
      this.minY = Math.min(this.minY, location.y);
      this.maxY = Math.max(this.maxY, location.y);

      const key = pointToKey(location);
      if (this.hull[key] == null) {
        this.hull[key] = BLACK;
      }
      computer.addInputs([this.hull[key]]);
    }

    for (let y = this.minY; y <= this.maxY; y += 1) {
      const row = [];
      for (let x = this.minX; x <= this.maxX; x += 1) {
        const key = pointToKey({ x, y });
        row.push((this.hull[key] ?? initialColor) ? "▓" : " ");
      }
      console.log(row.join(""));
    }

    return Object.keys(this.hull).length;
  }

  public async part1(): Promise<string | number> {
    return this.print(BLACK);
  }

  public async part2(): Promise<string | number> {
    this.print(WHITE);
    return "see console output";
  }
}
