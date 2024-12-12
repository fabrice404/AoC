import { getAllNeighborsCoordinates } from "../../helpers/array";
import { between } from "../../helpers/numbers";
import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  private animate() {
    const newGrid = this.cloneGrid();
    this.getGridLoopXY().forEach(({ x, y }) => {
      const isOn = this.getValue({ x, y }) === "#";
      const neighbors = getAllNeighborsCoordinates({ x, y });

      const neighborsOn = neighbors.filter((n) => this.isInGrid(n) && this.getValue(n) === "#");

      if ((isOn && between(neighborsOn.length, 2, 3)) || (!isOn && neighborsOn.length === 3)) {
        newGrid[y][x] = "#";
      } else {
        newGrid[y][x] = ".";
      }
    });
    this.grid = newGrid;
  }

  private lightCorners() {
    this.grid[0][0] = "#";
    this.grid[0][this.grid[0].length - 1] = "#";
    this.grid[this.grid.length - 1][0] = "#";
    this.grid[this.grid.length - 1][this.grid[0].length - 1] = "#";
  }

  public async part1(): Promise<string | number> {
    const steps = this.isExample ? 4 : 100;
    for (let i = 0; i < steps; i += 1) {
      this.animate();
    }

    return this.grid.flat(2).filter((c) => c === "#").length;
  }

  public async part2(): Promise<string | number> {
    this.setInput(this.input);
    this.lightCorners();

    const steps = this.isExample ? 5 : 100;
    for (let i = 0; i < steps; i += 1) {
      this.animate();
      this.lightCorners();
    }

    return this.grid.flat(2).filter((c) => c === "#").length;
  }
}
