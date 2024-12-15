import { sum } from "../../helpers/array";
import { moveTo, pointToKey } from "../../helpers/helpers";
import AoCPuzzle from "../../puzzle";
import { Direction, Point } from "../../types";

interface Move {
  from: Point;
  to: Point;
  value: string;
}

export default class Puzzle extends AoCPuzzle {
  private directions: { [key: string]: Direction } = {
    "^": "U",
    ">": "R",
    v: "D",
    "<": "L",
  };

  private robotPosition: Point = { x: -1, y: -1 };

  private applyMoves(moves: Move[]) {
    while (moves.length > 0) {
      const move = moves.find((m) => moves.every((m2) => pointToKey(m2.from) !== pointToKey(m.to)))!;
      moves = moves.filter((m) => !(m.from === move.from && m.to === move.to));

      this.setValue(move.to, move.value);
      this.setValue(move.from, ".");
    }
  }

  private move(p: Point, d: Direction): boolean {
    const currentValue = this.getValue(p);
    const nextPoint = moveTo(p, d);
    const nextValue = this.getValue(nextPoint);
    if (nextValue === "#") {
      return false;
    }
    let canMove = true;
    if (nextValue === "O") {
      canMove = this.move(nextPoint, d);
    }

    if (canMove) {
      this.setValue(nextPoint, currentValue);
      this.setValue(p, ".");
      if (currentValue === "@") {
        this.robotPosition = nextPoint;
      }
    }

    return canMove;
  }

  private moveWithBigBoxes(from: Point, d: Direction): Move[] {
    const fromValue = this.getValue(from);
    const to = moveTo(from, d);
    const toValue = this.getValue(to);

    const moves: Move[] = [];

    if (toValue === "#") {
      return [];
    }

    if (toValue === ".") {
      moves.unshift({ from, to, value: fromValue });
    }

    if (toValue === "[") {
      const leftSideOfBox = to;
      const rightSideOfBox = moveTo(to, "R");
      let leftSideMoves = [];
      let rightSideMoves = [];
      switch (d) {
        case "U":
        case "D":
          leftSideMoves = this.moveWithBigBoxes(to, d);
          rightSideMoves = this.moveWithBigBoxes(rightSideOfBox, d);
          if (leftSideMoves.length === 0 || rightSideMoves.length === 0) {
            return [];
          }
          moves.unshift({ from, to, value: fromValue });
          moves.unshift({ from: leftSideOfBox, to: moveTo(leftSideOfBox, d), value: "[" });
          moves.unshift({ from: rightSideOfBox, to: moveTo(rightSideOfBox, d), value: "]" });
          moves.unshift(...leftSideMoves, ...rightSideMoves);
          break;
        case "R":
          rightSideMoves = this.moveWithBigBoxes(to, d);
          if (rightSideMoves.length === 0) {
            return [];
          }
          moves.unshift({ from, to, value: fromValue });
          moves.unshift(...rightSideMoves);
          break;
        case "L":
          if (fromValue !== "]") {
            throw new Error(`unexpected character on right of [: ${fromValue} for move to ${d}`);
          }
          leftSideMoves = this.moveWithBigBoxes(to, d);
          if (leftSideMoves.length === 0) {
            return [];
          }
          moves.unshift({ from, to, value: fromValue });
          moves.unshift(...leftSideMoves);
          break;
      }
    }
    if (toValue === "]") {
      const rightSideOfBox = to;
      const leftSideOfBox = moveTo(to, "L");
      let leftSideMoves = [];
      let rightSideMoves = [];
      switch (d) {
        case "U":
        case "D":
          leftSideMoves = this.moveWithBigBoxes(leftSideOfBox, d);
          rightSideMoves = this.moveWithBigBoxes(to, d);
          if (leftSideMoves.length === 0 || rightSideMoves.length === 0) {
            return [];
          }
          moves.unshift({ from, to, value: fromValue });
          moves.unshift({ from: leftSideOfBox, to: moveTo(leftSideOfBox, d), value: "[" });
          moves.unshift({ from: rightSideOfBox, to: moveTo(rightSideOfBox, d), value: "]" });
          moves.unshift(...leftSideMoves, ...rightSideMoves);
          break;
        case "R":
          if (fromValue !== "[") {
            throw new Error(`unexpected character on left of ]: ${fromValue} for move to ${d}`);
          }
          rightSideMoves = this.moveWithBigBoxes(to, d);
          if (rightSideMoves.length === 0) {
            return [];
          }
          moves.unshift({ from, to, value: fromValue });
          moves.unshift(...rightSideMoves);
          break;
        case "L":
          leftSideMoves = this.moveWithBigBoxes(to, d);
          if (leftSideMoves.length === 0) {
            return [];
          }
          moves.unshift({ from, to, value: fromValue });
          moves.unshift(...leftSideMoves);
          break;
      }
    }

    if (fromValue === "@") {
      this.applyMoves(moves);
    }
    return moves;
  }

  public async part1(): Promise<string | number> {
    const [grid, instr] = JSON.parse(JSON.stringify(this.input)).split("\n\n");
    this.setInput(grid);
    const instructions = instr
      .replace(/[^(^|<|>|v)]/gm, "")
      .split("")
      .filter(Boolean);

    if (this.isExample) {
      this.printGrid();
    }

    this.robotPosition = this.getGridLoopXY().find((p) => this.getValue(p) === "@")!;

    for (const instruction of instructions) {
      this.move(this.robotPosition, this.directions[instruction]);
    }

    if (this.isExample) {
      this.printGrid();
    }

    return sum(
      this.getGridLoopXY()
        .filter((p) => this.getValue(p) === "O")
        .map((p) => 100 * p.y + p.x),
    );
  }

  public async part2(): Promise<string | number> {
    this.resetInput();

    const [grid, instr] = this.input.split("\n\n");
    this.setInput(grid);
    const extendedGrid = [];
    for (let y = 0; y < this.grid.length; y += 1) {
      const row: string[] = [];
      for (let x = 0; x < this.grid[y].length; x += 1) {
        const val = this.getValue({ x, y });
        switch (val) {
          case "#":
          case ".":
            row.push(val);
            row.push(val);
            break;
          case "O":
            row.push("[");
            row.push("]");
            break;
          case "@":
            row.push("@");
            row.push(".");
            break;
        }
      }
      extendedGrid.push(row);
    }
    this.grid = extendedGrid;

    const instructions = instr
      .replace(/[^(^|<|>|v)]/gm, "")
      .split("")
      .filter(Boolean);

    this.robotPosition = this.getGridLoopXY().find((p) => this.getValue(p) === "@")!;

    for (const instruction of instructions) {
      this.moveWithBigBoxes(this.robotPosition, this.directions[instruction]);
      this.robotPosition = this.getGridLoopXY().find((p) => this.getValue(p) === "@")!;
    }

    if (this.isExample) {
      this.printGrid();
    }

    return sum(
      this.getGridLoopXY()
        .filter((p) => this.getValue(p) === "[")
        .map((p) => 100 * p.y + p.x),
    );
  }
}
