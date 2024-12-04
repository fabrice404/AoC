import AoCPuzzle from "../../puzzle";

type Direction = "^" | "v" | "<" | ">";

interface Path {
  x: number;
  y: number;
  heatLoss: number;
  direction: Direction;
  steps: string;
  straight: number;
}

interface Move {
  x: number;
  y: number;
  direction: Direction;
}

class Queue {
  protected q: Path[] = [];

  public enqueue(path: Path) {
    this.q.push(path);
    this.q.sort((a, b) => (a.heatLoss < b.heatLoss ? -1 : 1));
  }

  public dequeue(): Path | undefined {
    return this.q.shift();
  }

  public get length() {
    return this.q.length;
  }
}

export default class Puzzle extends AoCPuzzle {
  private queue: Queue = new Queue();

  private seen: Map<string, number> = new Map();

  private getHeatLoss(x: number, y: number): number {
    return +this.grid[y][x];
  }

  private getNextMoves(path: Path): Move[] {
    const moves: Move[] = [];
    if (path.direction === "^") {
      moves.push({ x: path.x, y: path.y - 1, direction: "^" });
      moves.push({ x: path.x - 1, y: path.y, direction: "<" });
      moves.push({ x: path.x + 1, y: path.y, direction: ">" });
    } else if (path.direction === "v") {
      moves.push({ x: path.x, y: path.y + 1, direction: "v" });
      moves.push({ x: path.x - 1, y: path.y, direction: "<" });
      moves.push({ x: path.x + 1, y: path.y, direction: ">" });
    } else if (path.direction === "<") {
      moves.push({ x: path.x - 1, y: path.y, direction: "<" });
      moves.push({ x: path.x, y: path.y - 1, direction: "^" });
      moves.push({ x: path.x, y: path.y + 1, direction: "v" });
    } else if (path.direction === ">") {
      moves.push({ x: path.x + 1, y: path.y, direction: ">" });
      moves.push({ x: path.x, y: path.y - 1, direction: "^" });
      moves.push({ x: path.x, y: path.y + 1, direction: "v" });
    }
    return moves;
  }

  private run(ultraCrucible = false) {
    this.queue = new Queue();
    this.seen = new Map();
    this.queue.enqueue({
      x: 0,
      y: 0,
      heatLoss: 0,
      direction: ">",
      steps: ">",
      straight: 0,
    });
    this.queue.enqueue({
      x: 0,
      y: 0,
      heatLoss: 0,
      direction: "v",
      steps: "v",
      straight: 0,
    });

    // const results = [];
    while (this.queue.length > 0) {
      const path = this.queue.dequeue()!;

      // has reached the end?
      if (path.x === this.grid[0].length - 1 && path.y === this.grid.length - 1) {
        return path.heatLoss;
      }

      this.getNextMoves(path)
        .filter((move) => {
          if (ultraCrucible) {
            if (path.straight < 4) return path.direction === move.direction;
            if (path.straight > 9) return path.direction !== move.direction;
            return true;
          }
          return path.straight > 2 ? move.direction !== path.direction : true;
        })
        .filter((move) => move.x >= 0 && move.x < this.grid[0].length && move.y >= 0 && move.y < this.grid.length)
        .forEach((move) => {
          const { direction, x, y } = move;
          const heatLoss = path.heatLoss + this.getHeatLoss(x, y);
          const straight = path.direction === direction ? path.straight + 1 : 1;
          const steps = path.steps + direction;

          const key = `${x}-${y}-${direction}-${straight}`;
          if (!this.seen.has(key)) {
            this.seen.set(key, heatLoss);
            this.queue.enqueue({ x, y, direction, heatLoss, straight, steps });
          }
        });
    }
    return "ERROR";
  }

  public async part1(): Promise<string | number> {
    return this.run();
  }

  public async part2(): Promise<string | number> {
    return this.run(true);
  }
}
