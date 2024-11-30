
import { BinaryHeap } from '../../helpers/structures';

import AoCPuzzle from '../../puzzle';

export default class Puzzle extends AoCPuzzle {
  private target: any = {};

  private neighbours(node: any) {
    const neighbours = [];

    for (const [x, y] of [[node.x - 1, node.y], [node.x + 1, node.y], [node.x, node.y - 1], [node.x, node.y + 1]]) {
      if (this.grid[y] && this.grid[y][x]) {
        neighbours.push(this.grid[y][x]);
      }
    }

    return neighbours;
  }

  private heuristic(x1: number, y1: number, x2: number, y2: number) {
    return Math.abs(x2 - x1) + Math.abs(y2 - y1);
  }

  private search(scoreFunction: Function) {
    for (let y = 0; y < this.grid.length; y += 1) {
      for (let x = 0; x < this.grid[y].length; x += 1) {
        this.grid[y][x] = {
          value: this.grid[y][x],
          score: x === 0 && y === 0 ? 0 : +this.grid[y][x],
          f: 0,
          g: 0,
          h: 0,
          parent: null,
          visited: false,
          closed: false,
          x: x,
          y: y,
        }
      }
    }

    this.target = {
      x: this.grid[0].length - 1,
      y: this.grid.length - 1,
    };

    const openHeap = new BinaryHeap(scoreFunction);

    openHeap.push(this.grid[0][0]);

    while (openHeap.size() > 0) {
      const currentNode = openHeap.pop();

      if (currentNode.x === this.target.x && currentNode.y === this.target.y) {
        let curr = currentNode;
        const result = [];
        while (curr.parent) {
          result.push(curr);
          curr = curr.parent;
        }
        return result.reverse();
      }

      currentNode.closed = true;
      const neighbours = this.neighbours(currentNode);
      for (let i = 0; i < neighbours.length; i += 1) {
        const neighbour = neighbours[i];

        if (neighbour.closed) {
          continue;
        }

        const gScore = currentNode.g + neighbour.score;
        const hasBeenVisited = neighbour.visited

        if (!hasBeenVisited || gScore < neighbour.g) {

          neighbour.visited = true;
          neighbour.parent = currentNode;
          neighbour.h = neighbour.h || this.heuristic(neighbour.x, neighbour.y, this.target.x, this.target.y);
          neighbour.g = gScore;
          neighbour.f = neighbour.g + neighbour.h;

          if (!hasBeenVisited) {
            openHeap.push(neighbour)
          } else {
            openHeap.rescoreElement(neighbour);
          }
        }
      }
    }

    return [];
  }

  public async part1(): Promise<string | number> {
    const result = this.search((n: any) => n.f);
    return result.pop().f;
  }

  private valuate(value: number): string {
    if (value < 10) {
      return `${value}`;
    }
    return `${value % 9 + Math.floor(value / 9) - 1}`;
  }

  public async part2(): Promise<string | number> {
    this.setInput(this.input);

    const originalRows = this.lines.length;
    const rows = originalRows * 5;
    const originalColumns = this.lines[0].length;
    const columns = originalColumns * 5;

    for (let y = 0; y < rows; y += 1) {
      if (y >= originalRows) {
        this.grid[y] = [];
      }
      for (let x = 0; x < columns; x += 1) {
        let add = 0;
        let value = +this.grid[y % originalRows][x % originalColumns];
        if (x >= originalColumns) {
          add += Math.floor(x / originalColumns)
          value = +this.grid[y][x % originalColumns];
        }
        if (y >= originalRows && x < originalColumns) {
          add += Math.floor(y / originalRows)
        }
        this.grid[y][x] = this.valuate(value + add);
      }
    }

    const result = this.search((n: any) => n.f);
    return result.pop().f;
  }
}
