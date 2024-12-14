import { getAllNeighborsCoordinates, multiply } from "../../helpers/array";
import { absoluteModulo } from "../../helpers/numbers";
import AoCPuzzle from "../../puzzle";
import { Point } from "../../types";

interface Robot {
  position: Point;
  velocity: Point;
}

export default class Puzzle extends AoCPuzzle {
  private robots: Robot[] = [];

  public async part1(): Promise<string | number> {
    const width = this.isExample ? 11 : 101;
    const height = this.isExample ? 7 : 103;

    const w = Math.floor(width / 2);
    const h = Math.floor(height / 2);

    for (const line of this.lines) {
      const [x, y, vx, vy] = line
        .replace(/[^0-9-]/g, " ")
        .trim()
        .split(/\s+/)
        .map(Number);

      const robot: Robot = {
        position: { x, y },
        velocity: { x: vx, y: vy },
      };

      robot.position.x = absoluteModulo(x + 100 * vx, width);
      robot.position.y = absoluteModulo(y + 100 * vy, height);
      this.robots.push(robot);
    }

    if (this.isExample) {
      this.grid = Array.from({ length: height }, () => Array.from({ length: width }, () => "."));
      this.robots.forEach((robot) => {
        this.grid[robot.position.y][robot.position.x] = "#";
      });
      this.printGrid();
    }

    const q1 = this.robots.filter((robot) => robot.position.x < w && robot.position.y < h).length;
    const q2 = this.robots.filter((robot) => robot.position.x > w && robot.position.y < h).length;
    const q3 = this.robots.filter((robot) => robot.position.x < w && robot.position.y > h).length;
    const q4 = this.robots.filter((robot) => robot.position.x > w && robot.position.y > h).length;

    return multiply([q1, q2, q3, q4]);
  }

  public async part2(): Promise<string | number> {
    this.robots = [];
    const width = this.isExample ? 11 : 101;
    const height = this.isExample ? 7 : 103;

    for (const line of this.lines) {
      const [x, y, vx, vy] = line
        .replace(/[^0-9-]/g, " ")
        .trim()
        .split(/\s+/)
        .map(Number);

      const robot: Robot = {
        position: { x, y },
        velocity: { x: vx, y: vy },
      };
      this.robots.push(robot);
    }

    for (let second = 1; second < 10_000_000_000; second += 1) {
      for (const robot of this.robots) {
        robot.position.x = absoluteModulo(robot.position.x + robot.velocity.x, width);
        robot.position.y = absoluteModulo(robot.position.y + robot.velocity.y, height);
      }

      const group = this.robots.find((robot) =>
        getAllNeighborsCoordinates(robot.position).every((neighbor) => this.robots.find((r) => r.position.x === neighbor.x && r.position.y === neighbor.y)),
      );

      if (group) {
        this.grid = Array.from({ length: height }, () => Array.from({ length: width }, () => " "));
        this.robots.forEach((robot) => {
          this.grid[robot.position.y][robot.position.x] = "█";
        });
        this.highlightCell(group.position);
        this.printGrid();

        return second;
      }
    }

    return -1;
  }
}
