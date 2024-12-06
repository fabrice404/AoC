import { keyToPoint, moveToCardinal, pointToKey } from "../../helpers/helpers";
import AoCPuzzle from "../../puzzle";
import { CardinalDirection, Point } from "../../types";

const DIRECTIONS: CardinalDirection[] = ["N", "E", "S", "W"];

export default class Puzzle extends AoCPuzzle {
  private normalStepsCount = Number.MAX_SAFE_INTEGER;

  private steps: Set<string> = new Set<string>();

  private countSteps(grid: any[][], initialPosition: Point, initialDirection: CardinalDirection = "N"): number {
    grid[initialPosition.y][initialPosition.x] = ".";
    let currentPosition = initialPosition;
    let currentDirection = initialDirection;

    let i = 0;

    while (true) {
      this.steps.add(pointToKey(currentPosition));
      const nextPosition = moveToCardinal(currentPosition, currentDirection);
      if (!this.isInGrid(nextPosition)) {
        break;
      }

      const nextCellValue = grid[nextPosition.y][nextPosition.x];
      if (nextCellValue === "#") {
        currentDirection = DIRECTIONS[(DIRECTIONS.indexOf(currentDirection) + 1) % 4];
      } else if (nextCellValue === "." || nextCellValue === "X" || nextCellValue === "O") {
        grid[nextPosition.y][nextPosition.x] = "X";
        currentPosition = nextPosition;
        if (i > this.normalStepsCount * 2) {
          return Infinity;
        }
      }
      i += 1;
    }
    return this.steps.size;
  }

  public async part1(): Promise<string | number> {
    const [initialPosition] = this.findCellByValue("^");
    this.normalStepsCount = this.countSteps(JSON.parse(JSON.stringify(this.grid)), initialPosition);
    return this.normalStepsCount;
  }

  public async part2(): Promise<string | number> {
    const [initialPosition] = this.findCellByValue("^");
    return [...this.steps.keys()].filter((key) => {
      const { x, y } = keyToPoint(key);
      const grid = JSON.parse(JSON.stringify(this.grid));
      grid[y][x] = "#";
      return this.countSteps(grid, initialPosition) === Infinity;
    }).length;
  }
}
