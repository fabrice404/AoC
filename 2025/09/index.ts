import AoCPuzzle from "../../puzzle";
import { Point } from "../../types";

type HorizontalLine = {
  x1: number;
  x2: number;
  y: number;
};

type VerticalLine = {
  y1: number;
  y2: number;
  x: number;
};

export default class Puzzle extends AoCPuzzle {
  private points: Point[] = [];

  public async part1(): Promise<string | number> {
    this.points = this.lines.map((line) => {
      const [x, y] = line.split(",").map(Number);
      return { x, y };
    });

    const rectangles = [];
    for (let i = 0; i < this.points.length; i++) {
      for (let j = i + 1; j < this.points.length; j++) {
        const p1 = this.points[i];
        const p2 = this.points[j];
        const area = (Math.abs(p2.x - p1.x) + 1) * (Math.abs(p2.y - p1.y) + 1);
        rectangles.push(area);
      }
    }

    return Math.max(...rectangles);
  }

  public async part2(): Promise<string | number> {
    const horizontals: HorizontalLine[] = [];
    const verticals: VerticalLine[] = [];

    this.points.forEach((p1, i) => {
      const p2 = this.points[(i + 1) % this.points.length];
      if (p1.x === p2.x) {
        const y1 = Math.min(p1.y, p2.y);
        const y2 = Math.max(p1.y, p2.y);
        verticals.push({ y1, y2, x: p1.x });
      }
      if (p1.y === p2.y) {
        const x1 = Math.min(p1.x, p2.x);
        const x2 = Math.max(p1.x, p2.x);
        horizontals.push({ x1, x2, y: p1.y });
      }
    });

    const intersects = (h: HorizontalLine, v: VerticalLine) => {
      return h.y > v.y1 && h.y < v.y2 && v.x > h.x1 && v.x < h.x2;
    };

    const hasIntersection = (p1: Point, p2: Point) => {
      const x1 = Math.min(p1.x, p2.x) + 0.01;
      const x2 = Math.max(p1.x, p2.x) - 0.01;
      const y1 = Math.min(p1.y, p2.y) + 0.01;
      const y2 = Math.max(p1.y, p2.y) - 0.01;

      const top: HorizontalLine = { x1, x2, y: y1 };
      const bottom: HorizontalLine = { x1, x2, y: y2 };
      for (const v of verticals) {
        if (intersects(top, v) || intersects(bottom, v)) {
          return true;
        }
      }

      const left: VerticalLine = { y1, y2, x: x1 };
      const right: VerticalLine = { y1, y2, x: x2 };
      for (const h of horizontals) {
        if (intersects(h, left) || intersects(h, right)) {
          return true;
        }
      }

      return false;
    };

    let max = -Infinity;
    for (let i = 0; i < this.points.length; i++) {
      for (let j = i + 1; j < this.points.length; j++) {
        const p1 = this.points[i];
        const p2 = this.points[j];
        if (!hasIntersection(p1, p2)) {
          const area = (Math.abs(p2.x - p1.x) + 1) * (Math.abs(p2.y - p1.y) + 1);
          max = Math.max(max, area);
        }
      }
    }

    return max;
  }
}
