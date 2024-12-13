import AoCPuzzle from "../../puzzle";
import { Point } from "../../types";

export default class Puzzle extends AoCPuzzle {
  private addRow(y: number) {
    const row = [];
    for (let x = 0; x < this.grid[0].length; x += 1) {
      const left = this.isTrap({ x: x - 1, y });
      const right = this.isTrap({ x: x + 1, y });
      if (left !== right) {
        row.push("^");
      } else {
        row.push(".");
      }
    }
    this.grid.push(row);
  }

  private isTrap(p: Point) {
    if (!this.isInGrid(p)) {
      return false;
    }
    return this.getValue(p) !== ".";
  }

  public async part1(): Promise<string | number> {
    for (let y = 0; y < (this.isExample ? 10 : 40) - 1; y += 1) {
      this.addRow(y);
    }
    if (this.isExample) {
      this.printGrid();
    }
    return this.grid.flat().filter((x) => x === ".").length;
  }

  public async part2(): Promise<string | number> {
    this.setInput(this.input);

    for (let y = 0; y < 400000 - 1; y += 1) {
      this.addRow(y);
    }

    return this.grid.flat().filter((x) => x === ".").length;
  }
}
