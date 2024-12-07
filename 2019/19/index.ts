import AoCPuzzle from "../../puzzle";
import { Point } from "../../types";
import { IntCodeComputer } from "../int-code-computer";

export default class Puzzle extends AoCPuzzle {
  private getPoint(point: Point): number {
    const computer = new IntCodeComputer(this.input, [point.x, point.y]);
    computer.compute();
    return computer.output!;
  }

  public async part1(): Promise<string | number> {
    this.grid = [];
    let total = 0;
    for (let y = 0; y < 50; y += 1) {
      this.grid[y] = [];
      for (let x = 0; x < 50; x += 1) {
        const result = this.getPoint({ x, y });
        total += result;
        this.grid[y][x] = result ? "\x1b[0m█\x1b[0m" : "\x1b[30m█\x1b[0m";
      }
    }
    // this.printGrid();
    return total;
  }

  public async part2(): Promise<string | number> {
    const size = 10_000;

    let lastX = 0;
    for (let y = 0; y < size; y += 1) {
      for (let x = lastX - 1; x < size; x += 1) {
        const bottomLeftPoint = { x, y };
        const bottomLeft = this.getPoint(bottomLeftPoint);
        if (bottomLeft) {
          const topLeftPoint = { x, y: y - 99 };
          const topRightPoint = { x: x + 99, y: y - 99 };
          const topRight = this.getPoint(topRightPoint);

          if (topRight) {
            return topLeftPoint.x * 10_000 + topLeftPoint.y;
          }
          break;
        }
        lastX = x;
      }
      if (lastX === size - 1) {
        lastX = 0;
      }
    }
    return 0;
  }
}
