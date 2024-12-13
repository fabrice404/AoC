import AoCPuzzle from "../../puzzle";
import { Direction, Point } from "../../types";

export default class Puzzle extends AoCPuzzle {
  private direction: Direction = "D";

  private path: string[] = [];

  private position: Point = { x: 0, y: 0 };

  private isHorizontalCharacter(p: Point): boolean {
    const c = this.getValue(p);
    return c === "|" || c === "-" || c === "+" || !!c.match(/[a-zA-Z]/gi);
  }

  private isVerticalCharacter(p: Point): boolean {
    const c = this.getValue(p);
    return c === "|" || c === "-" || c === "+" || !!c.match(/[a-zA-Z]/gi);
  }

  private lookDown(): boolean {
    const nextPosition = { x: this.position.x, y: this.position.y + 1 };
    if (this.isInGrid(nextPosition) && this.isVerticalCharacter(nextPosition)) {
      this.position = nextPosition;
      this.direction = "D";
      return true;
    }
    return false;
  }

  private lookLeft(): boolean {
    const nextPosition = { x: this.position.x - 1, y: this.position.y };
    if (this.isInGrid(nextPosition) && this.isHorizontalCharacter(nextPosition)) {
      this.position = nextPosition;
      this.direction = "L";
      return true;
    }
    return false;
  }

  private lookRight(): boolean {
    const nextPosition = { x: this.position.x + 1, y: this.position.y };
    if (this.isInGrid(nextPosition) && this.isHorizontalCharacter(nextPosition)) {
      this.position = nextPosition;
      this.direction = "R";
      return true;
    }
    return false;
  }

  private lookUp(): boolean {
    const nextPosition = { x: this.position.x, y: this.position.y - 1 };
    if (this.isInGrid(nextPosition) && this.isVerticalCharacter(nextPosition)) {
      this.position = nextPosition;
      this.direction = "U";
      return true;
    }
    return false;
  }

  public async part1(): Promise<string | number> {
    this.position = { x: this.lines[0].indexOf("|"), y: 0 };
    this.direction = "D";

    const stop = false;

    while (!stop) {
      const lastPosition = this.position;
      switch (this.direction as Direction) {
        case "D":
          if (!this.lookDown()) {
            if (!this.lookRight()) {
              this.lookLeft();
            }
          }
          break;
        case "U":
          if (!this.lookUp()) {
            if (!this.lookRight()) {
              this.lookLeft();
            }
          }
          break;
        case "L":
          if (!this.lookLeft()) {
            if (!this.lookUp()) {
              this.lookDown();
            }
          }
          break;
        case "R":
          if (!this.lookRight()) {
            if (!this.lookUp()) {
              this.lookDown();
            }
          }
          break;
      }
      if (lastPosition === this.position) {
        console.log("Movement stopped!");
        break;
      }
      if (this.isExample) {
        this.highlightCell(this.position);
        this.printGrid();
      }
      this.path.push(this.getValue(this.position));
    }

    return this.path.join("").replace(/[^a-zA-Z]/gi, "");
  }

  public async part2(): Promise<string | number> {
    return this.path.length + 1;
  }
}
