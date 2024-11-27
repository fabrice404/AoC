import AoCPuzzle from '../../puzzle';

interface Step {
  x: number;
  y: number;
}

export default class Puzzle extends AoCPuzzle {
  private targetX: number = 0;

  private targetY: number = 0;

  private shortestPathLength: number = Number.MAX_SAFE_INTEGER;

  private visited: string[] = [];

  private isWall(x: number, y: number): boolean {
    if (x < 0 || y < 0) {
      return true;
    }

    const num = ((x * x) + (3 * x) + (2 * x * y) + (y) + (y * y)) + +this.input;
    const binary = num.toString(2);
    return binary.split('').filter((c) => c === '1').length % 2 !== 0;
  }

  private isAlreadyVisited(x: number, y: number, steps: Step[]): boolean {
    return steps.some((step) => step.x === x && step.y === y);
  }

  private moveToTarget(x: number, y: number, steps: Step[]): void {
    if (x === this.targetX && y === this.targetY) {
      if (steps.length < this.shortestPathLength) {
        this.shortestPathLength = steps.length;
      }
      return;
    }
    if (steps.length >= this.shortestPathLength) {
      return;
    }

    // move north
    if (!this.isWall(x, y - 1) && !this.isAlreadyVisited(x, y - 1, steps)) {
      this.moveToTarget(x, y - 1, [...steps, { x, y }]);
    }
    // move east
    if (!this.isWall(x + 1, y) && !this.isAlreadyVisited(x + 1, y, steps)) {
      this.moveToTarget(x + 1, y, [...steps, { x, y }]);
    }
    // move south
    if (!this.isWall(x, y + 1) && !this.isAlreadyVisited(x, y + 1, steps)) {
      this.moveToTarget(x, y + 1, [...steps, { x, y }]);
    }
    // move west
    if (!this.isWall(x - 1, y) && !this.isAlreadyVisited(x - 1, y, steps)) {
      this.moveToTarget(x - 1, y, [...steps, { x, y }]);
    }
  }

  public async part1(): Promise<string | number> {
    this.targetX = this.isExample ? 7 : 31;
    this.targetY = this.isExample ? 4 : 39;
    this.moveToTarget(1, 1, []);

    return this.shortestPathLength;
  }

  private moveUntilSteps(x: number, y: number, steps: Step[]): void {
    if (steps.length <= 50) {
      const key = `${x},${y}`;
      if (!this.visited.includes(key)) {
        this.visited.push(key);
      }
    } else {
      return;
    }

    // move north
    if (!this.isWall(x, y - 1) && !this.isAlreadyVisited(x, y - 1, steps)) {
      this.moveUntilSteps(x, y - 1, [...steps, { x, y }]);
    }
    // move east
    if (!this.isWall(x + 1, y) && !this.isAlreadyVisited(x + 1, y, steps)) {
      this.moveUntilSteps(x + 1, y, [...steps, { x, y }]);
    }
    // move south
    if (!this.isWall(x, y + 1) && !this.isAlreadyVisited(x, y + 1, steps)) {
      this.moveUntilSteps(x, y + 1, [...steps, { x, y }]);
    }
    // move west
    if (!this.isWall(x - 1, y) && !this.isAlreadyVisited(x - 1, y, steps)) {
      this.moveUntilSteps(x - 1, y, [...steps, { x, y }]);
    }
  }

  public async part2(): Promise<string | number> {
    this.moveUntilSteps(1, 1, []);
    return this.visited.length;
  }
}
