import { pointToKey } from "../../helpers/helpers";
import AoCPuzzle from "../../puzzle";
import { CardinalDirection, Point } from "../../types";

const DIRECTIONS: CardinalDirection[] = ["N", "E", "S", "W"];

export default class Puzzle extends AoCPuzzle {
  private newObstructionsCount = 0;

  private normalStepsCount = Number.MAX_SAFE_INTEGER;

  private turns: { [key: string]: Point[] } = {
    N: [],
    E: [],
    S: [],
    W: [],
  };

  private countSteps(grid: any[][], initialPosition: Point, initialDirection: CardinalDirection = "N"): number {
    grid[initialPosition.y][initialPosition.x] = ".";
    let currentPosition = initialPosition;
    let currentDirection = initialDirection;

    const steps: Set<string> = new Set<string>();
    let i = 0;

    // this.turns["N"].push(currentPosition);
    while (true) {
      steps.add(pointToKey(currentPosition));
      let nextPosition;
      switch (currentDirection) {
        case "N":
          nextPosition = { y: currentPosition.y - 1, x: currentPosition.x };
          break;
        case "S":
          nextPosition = { y: currentPosition.y + 1, x: currentPosition.x };
          break;
        case "W":
          nextPosition = { y: currentPosition.y, x: currentPosition.x - 1 };
          break;
        case "E":
          nextPosition = { y: currentPosition.y, x: currentPosition.x + 1 };
          break;
      }
      if (nextPosition.y < 0 || nextPosition.y >= grid.length || nextPosition.x < 0 || nextPosition.x >= grid[nextPosition.y].length) {
        break;
      }

      const nextCellValue = grid[nextPosition.y][nextPosition.x];
      if (nextCellValue === "#") {
        currentDirection = DIRECTIONS[(DIRECTIONS.indexOf(currentDirection) + 1) % 4];
        // this.turns[currentDirection].push(currentPosition);
      } else if (nextCellValue === "." || nextCellValue === "X" || nextCellValue === "O") {
        grid[nextPosition.y][nextPosition.x] = "X";
        // if (
        //   (currentDirection === "N" && this.turns["E"].find((p) => p.y === currentPosition.y)) ||
        //   (currentDirection === "E" && this.turns["S"].find((p) => p.x === currentPosition.x)) ||
        //   (currentDirection === "S" && this.turns["W"].find((p) => p.y === currentPosition.y)) ||
        //   (currentDirection === "W" && this.turns["N"].find((p) => p.x === currentPosition.x))
        // ) {
        //   this.newObstructionsCount += 1;
        //   this.grid[nextPosition.y][nextPosition.x] = "O";
        // }

        currentPosition = nextPosition;
        if (i > this.normalStepsCount * 2) {
          return Infinity;
        }
      }
      i += 1;
    }
    return steps.size;
  }

  public async part1(): Promise<string | number> {
    const [initialPosition] = this.findCellByValue("^");
    this.normalStepsCount = this.countSteps(JSON.parse(JSON.stringify(this.grid)), initialPosition);
    return this.normalStepsCount;
  }

  public async part2(): Promise<string | number> {
    const [initialPosition] = this.findCellByValue("^");
    console.log(this.normalStepsCount);
    return this.getGridLoopXY().filter(({ x, y }) => {
      const grid = JSON.parse(JSON.stringify(this.grid));
      grid[y][x] = "#";
      return this.countSteps(grid, initialPosition) === Infinity;
    }).length;
  }
}
