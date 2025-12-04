import { getAllNeighborsCoordinates } from "../../helpers/array";
import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  public async part1(): Promise<string | number> {
    this.getGridLoopXY()
      .filter((p) => this.getValue(p) === "@")
      .forEach(({ x, y }) => {
        const neighbours = getAllNeighborsCoordinates({ x, y }).filter((p) => this.isInGrid(p));
        const adjacentRolls = neighbours.filter((p) => this.getValue(p) === "@" || this.getValue(p) === "x");

        if (adjacentRolls.length < 4) {
          this.setValue({ x, y }, "x");
        }
      });
    return this.findCellByValue("x").length;
  }

  public async part2(): Promise<string | number> {
    this.resetInput();
    let removed = 0;
    let canRemove = true;

    while (canRemove) {
      canRemove = false;
      this.getGridLoopXY()
        .filter((p) => this.getValue(p) === "@")
        .forEach(({ x, y }) => {
          const neighbours = getAllNeighborsCoordinates({ x, y }).filter((p) => this.isInGrid(p));
          const adjacentRolls = neighbours.filter((p) => this.getValue(p) === "@" || this.getValue(p) === "x");

          if (adjacentRolls.length < 4) {
            this.setValue({ x, y }, "x");
            canRemove = true;
          }
        });
      this.findCellByValue("x").forEach((p) => {
        this.setValue(p, ".");
        removed += 1;
      });
    }
    return removed;
  }
}
