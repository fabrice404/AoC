import { isNextTo } from "../../helpers/array";
import AoCPuzzle from "../../puzzle";

interface Point {
  x: number;
  y: number;
}

export default class Puzzle extends AoCPuzzle {
  private height: number = 0;

  private points: Point[] = [];

  private width: number = 0;

  private x: number = 0;

  private y: number = 0;

  private bruteForce(instructions: string[]): number {
    this.grid = [];

    let [minX, minY, maxX, maxY] = [0, 0, 0, 0];
    instructions.forEach((line) => {
      const [direction, sdistance] = line.replace(/\(|\)/gi, "").split(" ");

      const distance = parseInt(sdistance, 10);
      switch (direction) {
        case "U":
          this.y -= distance;
          break;
        case "D":
          this.y += distance;
          break;
        case "L":
          this.x -= distance;
          break;
        case "R":
          this.x += distance;
          break;
        default:
          break;
      }
      minX = Math.min(minX, this.x);
      maxX = Math.max(maxX, this.x);
      minY = Math.min(minY, this.y);
      maxY = Math.max(maxY, this.y);
    });

    this.width = maxX - minX + 2;
    this.height = maxY - minY + 2;

    this.x = Math.abs(minX) + 1;
    this.y = Math.abs(minY) + 1;

    this.grid = Array(this.height)
      .fill(0)
      .map(() => Array(this.width).fill("."));
    this.grid[this.y][this.x] = "#";

    instructions.forEach((line) => {
      const [direction, distance] = line.replace(/\(|\)/gi, "").split(" ");

      for (let i = 0; i < parseInt(distance, 10); i += 1) {
        switch (direction) {
          case "U":
            this.y -= 1;
            break;
          case "D":
            this.y += 1;
            break;
          case "L":
            this.x -= 1;
            break;
          case "R":
            this.x += 1;
            break;
          default:
            break;
        }
        this.grid[this.y][this.x] = "#";
      }
    });

    const INSIDE = ".";
    const OUTSIDE = "O";
    let count = this.grid.flat().filter((x) => x === OUTSIDE).length;
    let prevCount = -1;

    while (count !== prevCount) {
      prevCount = count;
      this.grid.forEach((line, y) => {
        line.forEach((value, x) => {
          if (value === INSIDE) {
            if (x === 0 || y === 0 || x === line.length - 1 || y === this.grid.length - 1) {
              this.grid[y][x] = OUTSIDE;
            }
            if (isNextTo(this.grid, x, y, OUTSIDE)) {
              this.grid[y][x] = OUTSIDE;
            }
          }
        });
      });
      count = this.grid.flat().filter((x) => x === OUTSIDE).length;
    }

    return this.grid.flat().filter((x) => ["#", "."].includes(x)).length;
  }

  private getLastPoint(): Point {
    return this.points[this.points.length - 1];
  }

  private run(instructions: string[]): number {
    this.points = [{ x: 0, y: 0 }];

    let perimeter = 0;
    instructions.forEach((line) => {
      const [direction, sdistance] = line.replace(/\(|\)/gi, "").split(" ");
      const distance = parseInt(sdistance, 10);

      const lastPoint = this.getLastPoint();

      let newX = -Infinity;
      let newY = -Infinity;
      switch (direction) {
        case "U":
          newX = lastPoint.x;
          newY = lastPoint.y - distance;
          break;
        case "D":
          newX = lastPoint.x;
          newY = lastPoint.y + distance;
          break;
        case "L":
          newX = lastPoint.x - distance;
          newY = lastPoint.y;
          break;
        case "R":
          newX = lastPoint.x + distance;
          newY = lastPoint.y;
          break;
        default:
          break;
      }

      perimeter += distance;
      this.points.push({ x: newX, y: newY });
    });

    // https://www.theoremoftheday.org/GeometryAndTrigonometry/Shoelace/TotDShoelace.pdf
    let area = 0;
    for (let i = 0; i < this.points.length; i += 1) {
      area += this.points[i].x * this.points[(i + 1) % this.points.length].y - this.points[i].y * this.points[(i + 1) % this.points.length].x;
    }
    area = Math.abs(area) / 2;

    // https://www.theoremoftheday.org/GeometryAndTrigonometry/Pick/TotDPick.pdf
    return area + perimeter / 2 + 1;
  }

  public async part1(): Promise<string | number> {
    return this.run(this.lines);
  }

  public async part2(): Promise<string | number> {
    const instructions = this.lines.map((line) => {
      const [, hexa] = line.split(/\(|\)/gi).filter((x) => x);
      const distance = parseInt(hexa.substring(1, 6), 16);
      let direction = hexa.substring(6, 7);
      switch (direction) {
        case "0":
          direction = "R";
          break;
        case "1":
          direction = "D";
          break;
        case "2":
          direction = "L";
          break;
        case "3":
          direction = "U";
          break;
        default:
          break;
      }
      return `${direction} ${distance} (${hexa})`;
    });
    return this.run(instructions);
  }
}
