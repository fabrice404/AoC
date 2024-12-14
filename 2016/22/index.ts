import { pointToKey } from "../../helpers/helpers";
import AoCPuzzle from "../../puzzle";
import { manhattanDistance } from "../../helpers/numbers";
import { Point } from "../../types";

interface Node {
  x: number;
  y: number;
  size: number;
  used: number;
  avail: number;
  use: number;
  key: string;
}

export default class Puzzle extends AoCPuzzle {
  private maxX: number = 0;

  private maxY: number = 0;
  private nodes: Node[] = [];

  private canMoveAround(node: Node) {
    return this.nodes.some((n) => n.key !== node.key && n.avail >= node.used);
  }

  public async part1(): Promise<string | number> {
    this.nodes = this.lines.slice(2).map((line) => {
      const [x, y, size, used, avail, use] = line.match(/\d+/g)!.map(Number);
      this.maxX = Math.max(this.maxX, x);
      this.maxY = Math.max(this.maxY, y);
      return { x, y, size, used, avail, use, key: pointToKey({ x, y }) };
    });

    return this.nodes.filter((node) => node.used !== 0 && this.canMoveAround(node)).length;
  }

  public async part2(): Promise<string | number> {
    const goal: Point = { x: 0, y: 0 };
    const data: Point = { x: this.maxX, y: 0 };
    let unused: Point = { x: -1, y: -1 };
    let wall: Point = { x: -1, y: -1 };

    this.grid = Array.from({ length: this.maxY + 1 }, () => Array.from({ length: this.maxX + 1 }, () => "."));

    for (const node of this.nodes) {
      if (node.used === 0) {
        this.grid[node.y][node.x] = "E";
        unused = { x: node.x, y: node.y };
      } else if (!this.canMoveAround(node)) {
        this.grid[node.y][node.x] = "#";
        if (wall.x === -1) {
          wall = { x: node.x, y: node.y };
        }
      }
    }
    this.grid[data.y][data.x] = "G";
    this.grid[goal.y][goal.x] = "*";

    this.printGrid();

    const fromLeftOfWallToData = manhattanDistance(data, { x: wall.x - 1, y: wall.y });
    const fromLeftOfWallToUnused = manhattanDistance(unused, { x: wall.x - 1, y: wall.y });
    const fromDataToGoal = manhattanDistance(data, goal);

    // https://www.reddit.com/r/adventofcode/comments/5jry0y/comment/dbit2um/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button
    // 5 * (distance valuable data to goal) + (distance from valuable data to nearest empty square).
    return 5 * (fromDataToGoal - 1) + fromLeftOfWallToData + fromLeftOfWallToUnused;
  }
}
