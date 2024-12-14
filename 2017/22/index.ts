import { DIRECTIONS, moveTo } from "../../helpers/helpers";
import { absoluteModulo } from "../../helpers/numbers";
import AoCPuzzle from "../../puzzle";
import { Direction, Point } from "../../types";

export default class Puzzle extends AoCPuzzle {
  private direction: Direction = "U";

  private position: Point = { x: 0, y: 0 };

  private turnLeft(): void {
    this.direction = DIRECTIONS[absoluteModulo(DIRECTIONS.indexOf(this.direction) - 1, DIRECTIONS.length)];
  }

  private turnRight(): void {
    this.direction = DIRECTIONS[absoluteModulo(DIRECTIONS.indexOf(this.direction) + 1, DIRECTIONS.length)];
  }

  public async part1(): Promise<string | number> {
    this.position = { x: ~~(this.grid[0].length / 2), y: ~~(this.grid.length / 2) };
    this.direction = "U";

    this.extendGrid(2_000);
    this.position = { x: this.position.x + 2000, y: this.position.y + 2000 };

    let infections = 0;

    for (let i = 0; i < 10_000; i += 1) {
      if (this.getValue(this.position) === "#") {
        this.turnRight();
        this.setValue(this.position, ".");
      } else {
        infections += 1;
        this.turnLeft();
        this.setValue(this.position, "#");
      }

      this.position = moveTo(this.position, this.direction);
    }

    return infections;
  }

  public async part2(): Promise<string | number> {
    this.setInput(this.input);
    this.position = { x: ~~(this.grid[0].length / 2), y: ~~(this.grid.length / 2) };
    this.direction = "U";

    this.extendGrid(2_000);
    this.position = { x: this.position.x + 2000, y: this.position.y + 2000 };

    let infections = 0;

    for (let i = 0; i < 10_000_000; i += 1) {
      switch (this.getValue(this.position)) {
        case ".": // clean
          this.turnLeft();
          this.setValue(this.position, "W");
          break;
        case "W": // weakened
          infections += 1;
          this.setValue(this.position, "#");
          break;
        case "#": // infected
          this.turnRight();
          this.setValue(this.position, "F");
          break;
        case "F": // flagged
          this.turnLeft();
          this.turnLeft();
          this.setValue(this.position, ".");
      }

      this.position = moveTo(this.position, this.direction);
    }

    return infections;
  }
}
