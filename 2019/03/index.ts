import AoCPuzzle from "../../puzzle";

interface Position {
  x: number;
  y: number;
}

type Direction = "U" | "R" | "D" | "L";

export default class Puzzle extends AoCPuzzle {
  private paths: string[][] = [[], []];

  private intersections: Set<string> = new Set<string>();

  private positionToKey(position: Position): string {
    return `${position.x},${position.y}`;
  }

  private keyToPosition(key: string): Position {
    const [x, y] = key.split(",").map(Number);
    return { x, y };
  }

  private move(position: Position, direction: Direction, quantity: number): string[] {
    const path: string[] = [];
    for (let i = 0; i < quantity; i += 1) {
      switch (direction) {
        case "U":
          position = { x: position.x, y: position.y - 1 };
          break;
        case "D":
          position = { x: position.x, y: position.y + 1 };
          break;
        case "R":
          position = { x: position.x + 1, y: position.y };
          break;
        case "L":
          position = { x: position.x - 1, y: position.y };
          break;
        default:
          throw new Error(`Unknown direction: ${direction}`);
      }
      path.push(this.positionToKey(position));
    }
    return path;
  }

  public async part1(): Promise<string | number> {
    for (let i = 0; i < this.lines.length; i += 1) {
      const moves = this.lines[i].split(",");
      let position = { x: 0, y: 0 };

      for (let j = 0; j < moves.length; j += 1) {
        const direction = moves[j].slice(0, 1) as Direction;
        const quantity = +moves[j].slice(1);
        const path = this.move(position, direction, quantity);
        if (path.length) {
          position = this.keyToPosition(path.slice(-1)[0]);
          path.forEach((p) => {
            this.paths[i].push(p);
            if (i === 1 && this.paths[0].includes(p)) {
              this.intersections.add(p);
            }
          });
        }
      }
    }

    let shortestDistanceToIntersection = Number.MAX_SAFE_INTEGER;

    for (const key of this.intersections.keys()) {
      const { x, y } = this.keyToPosition(key);
      shortestDistanceToIntersection = Math.min(shortestDistanceToIntersection, Math.abs(x) + Math.abs(y));
    }

    return shortestDistanceToIntersection;
  }

  public async part2(): Promise<string | number> {
    let shortestDistanceToIntersection = Number.MAX_SAFE_INTEGER;
    for (const key of this.intersections.keys()) {
      const a = this.paths[0].indexOf(key) + 1;
      const b = this.paths[1].indexOf(key) + 1;
      shortestDistanceToIntersection = Math.min(shortestDistanceToIntersection, a + b);
    }
    return shortestDistanceToIntersection;
  }
}
