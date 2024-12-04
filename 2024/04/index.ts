import AoCPuzzle from "../../puzzle";
import { Point } from "../../types";

export default class Puzzle extends AoCPuzzle {
  private masXShapedWords = 0;

  private xmasWords = 0;

  private findMasXShapedWords(p: Point): void {
    if (p.y >= 1 && p.y < this.grid.length - 1 && p.x >= 1 && p.x < this.grid[0].length - 1) {
      const tl = this.grid[p.y - 1][p.x - 1];
      const tr = this.grid[p.y - 1][p.x + 1];
      const bl = this.grid[p.y + 1][p.x - 1];
      const br = this.grid[p.y + 1][p.x + 1];

      if (
        ((tl.includes("M") && br.includes("S")) || (tl.includes("S") && br.includes("M"))) &&
        ((tr.includes("M") && bl.includes("S")) || (tr.includes("S") && bl.includes("M")))
      ) {
        this.masXShapedWords += 1;
        [
          { x: p.x, y: p.y },
          { x: p.x - 1, y: p.y - 1 },
          { x: p.x + 1, y: p.y - 1 },
          { x: p.x - 1, y: p.y + 1 },
          { x: p.x + 1, y: p.y + 1 },
        ].forEach((cell) => {
          this.highlightCell(cell!);
        });
      }
    }
  }

  private findXmas(p: Point): void {
    for (let y = -1; y <= 1; y += 1) {
      for (let x = -1; x <= 1; x += 1) {
        if (x === 0 && y === 0) {
          continue;
        }
        if (
          p.y + 3 * y >= 0 &&
          p.y + 3 * y < this.grid.length &&
          p.x + 3 * x >= 0 &&
          p.x + 3 * x < this.grid[0].length &&
          this.grid[p.y + 1 * y][p.x + 1 * x].includes("M") &&
          this.grid[p.y + 2 * y][p.x + 2 * x].includes("A") &&
          this.grid[p.y + 3 * y][p.x + 3 * x].includes("S")
        ) {
          this.xmasWords += 1;
          [
            { x: p.x, y: p.y },
            { x: p.x + 1 * x, y: p.y + 1 * y },
            { x: p.x + 2 * x, y: p.y + 2 * y },
            { x: p.x + 3 * x, y: p.y + 3 * y },
          ].forEach((cell) => {
            this.highlightCell(cell!);
          });
        }
      }
    }
  }

  public async part1(): Promise<string | number> {
    for (let y = 0; y < this.grid.length; y += 1) {
      for (let x = 0; x < this.grid[y].length; x += 1) {
        if (this.grid[y][x].includes("X")) {
          this.findXmas({ x, y });
        }
      }
    }

    if (this.isExample) {
      this.printGrid();
    }
    return this.xmasWords;
  }

  public async part2(): Promise<string | number> {
    this.setInput(this.input);

    for (let y = 0; y < this.grid.length; y += 1) {
      for (let x = 0; x < this.grid[y].length; x += 1) {
        if (this.grid[y][x].includes("A")) {
          this.findMasXShapedWords({ x, y });
        }
      }
    }

    if (this.isExample) {
      this.printGrid();
    }
    return this.masXShapedWords;
  }
}
