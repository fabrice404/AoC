import { isNextTo, print2d } from "../../helpers/array";
import AoCPuzzle from "../../puzzle";

interface Point {
  x: number;
  y: number;
  value: string;
  next?: Point;
}

export default class Puzzle extends AoCPuzzle {
  private points: Point[] = [];

  public async part1(): Promise<string | number> {
    this.points = [];
    this.lines.forEach((line, y) => {
      line.split("").forEach((value, x) => {
        this.points.push({ x, y, value });
      });
    });

    const initialPoint = this.points.find((p) => p.value === "S")!;
    let prevPoint: Point = initialPoint;
    // both test and input give the bottom point as next point from starting point
    let point: Point = this.points.find((p) => p.x === prevPoint.x && p.y === prevPoint.y + 1)!;

    let i = 1;

    do {
      const entry = prevPoint.x === point.x ? (prevPoint.y > point.y ? "bottom" : "top") : prevPoint.x > point.x ? "right" : "left";

      let exit: "top" | "bottom" | "left" | "right" | undefined;
      switch (point.value) {
        case "F":
          exit = entry === "bottom" ? "right" : "bottom";
          break;
        case "L":
          exit = entry === "top" ? "right" : "top";
          break;
        case "J":
          exit = entry === "top" ? "left" : "top";
          break;
        case "7":
          exit = entry === "bottom" ? "left" : "bottom";
          break;
        case "|":
          exit = entry === "top" ? "bottom" : "top";
          break;
        case "-":
          exit = entry === "left" ? "right" : "left";
          break;
        case "S":
          break;
        default:
          throw new Error(`Unknown value ${point.value}`);
      }

      switch (exit) {
        case "top": // x, y-1, must be F, 7 or |
          point.next = this.points.find((p) => p.x === point.x && p.y === point.y - 1 && ["F", "7", "|"].includes(p.value));
          break;
        case "bottom": // x, y+1, must be L, J or |
          point.next = this.points.find((p) => p.x === point.x && p.y === point.y + 1 && ["L", "J", "|"].includes(p.value));
          break;
        case "left": // x-1, y, must be F, L or -
          point.next = this.points.find((p) => p.x === point.x - 1 && p.y === point.y && ["F", "L", "-"].includes(p.value));
          break;
        case "right": // x+1, y, must be J, 7 or -
          point.next = this.points.find((p) => p.x === point.x + 1 && p.y === point.y && ["J", "7", "-"].includes(p.value));
          break;
        default:
          throw new Error(`Unknown exit ${exit}`);
      }

      prevPoint = point;
      point = point.next!;
      i += 1;
    } while (point && i < this.points.length);

    prevPoint.next = initialPoint;
    return i / 2;
  }

  public async part2(): Promise<string | number> {
    this.part1();

    const INSIDE = "I";
    const OUTSIDE = "O";
    const BETTER_TABLE: any = {
      F: "┌",
      7: "┐",
      L: "└",
      J: "┘",
      "|": "│",
      "-": "─",
    };

    let cleanedGrid: string[][] = this.lines.map((line, y) =>
      line.split("").map((value, x) => {
        const point = this.points.find((p) => p.x === x && p.y === y);
        return point?.next || point?.value === "S" ? `${BETTER_TABLE[value] || value}` : INSIDE;
      }),
    );

    // replace S by its real value
    {
      const pointS = this.points.find((p) => p.value === "S")!;
      const left = cleanedGrid[pointS.y]?.[pointS.x - 1];
      const right = cleanedGrid[pointS.y]?.[pointS.x + 1];

      const top = cleanedGrid[pointS.y - 1]?.[pointS.x];
      const bottom = cleanedGrid[pointS.y + 1]?.[pointS.x];

      const fromleft = left?.match(/┌|└|─/) || false;
      const fromRight = right?.match(/┐|┘|─/) || false;
      const fromTop = top?.match(/┌|┐|│/) || false;
      const fromBottom = bottom?.match(/└|┘|│/) || false;

      if (fromleft) {
        if (fromBottom) {
          cleanedGrid[pointS.y][pointS.x] = BETTER_TABLE["7"];
        } else if (fromTop) {
          cleanedGrid[pointS.y][pointS.x] = BETTER_TABLE.J;
        } else if (fromRight) {
          cleanedGrid[pointS.y][pointS.x] = BETTER_TABLE["-"];
        }
      } else if (fromRight) {
        if (fromBottom) {
          cleanedGrid[pointS.y][pointS.x] = BETTER_TABLE.F;
        } else if (fromTop) {
          cleanedGrid[pointS.y][pointS.x] = BETTER_TABLE.L;
        }
      } else if (fromTop && fromBottom) {
        cleanedGrid[pointS.y][pointS.x] = BETTER_TABLE["|"];
      }
    }

    // add columns
    cleanedGrid = cleanedGrid.map((line) =>
      line.map((value) => {
        if (value !== INSIDE) {
          if (["┌", "└", "─"].includes(value)) {
            return `${value}─`;
          }
          if (["┐", "┘", "│"].includes(value)) {
            return `${value}${INSIDE}`;
          }
        }
        return `${value}${value}`;
      }),
    );

    // add rows
    const newGrid: string[][] = [];
    for (let i = 0; i < cleanedGrid.length; i += 1) {
      const line = cleanedGrid[i].join("").split("");
      const newLine: string[] = [];
      for (let j = 0; j < line.length; j += 1) {
        const value = line[j];
        let newValue = INSIDE;
        if (value !== INSIDE && ["┌", "┐", "│"].includes(value)) {
          newValue = "│";
        }
        newLine.push(newValue);
      }
      newGrid.push(line);
      newGrid.push(newLine);
    }
    cleanedGrid = newGrid;

    let count = cleanedGrid.flat().filter((x) => x === OUTSIDE).length;
    let prevCount = -1;

    while (count !== prevCount) {
      cleanedGrid.forEach((line, y) => {
        line.forEach((value, x) => {
          if (value === INSIDE) {
            if (x === 0 || y === 0 || x === line.length - 1 || y === cleanedGrid.length - 1) {
              cleanedGrid[y][x] = OUTSIDE;
            }
            if (isNextTo(cleanedGrid, x, y, OUTSIDE)) {
              cleanedGrid[y][x] = OUTSIDE;
            }
          }
        });
      });
      prevCount = count;
      count = cleanedGrid.flat().filter((x) => x === OUTSIDE).length;
    }

    print2d(
      cleanedGrid
        .map((line, y) => {
          if (y % 2 === 1) {
            return [];
          }
          return line
            .map((value, x) => {
              if (x % 2 === 1) {
                return null;
              }
              let color = "";
              switch (value) {
                case INSIDE:
                  color = "\x1b[31m";
                  break;
                case OUTSIDE:
                  color = "\x1b[90m";
                  break;
                default:
                  color = "\x1b[0m";
                  break;
              }
              return `${color}${value}\x1b[0m`;
            })
            .filter((x) => x);
        })
        .filter((x) => x?.length > 0),
    );

    let sum = 0;
    for (let i = 0; i < cleanedGrid.length; i += 2) {
      for (let j = 0; j < cleanedGrid[i].length; j += 2) {
        if (cleanedGrid[i][j] === INSIDE) {
          sum += 1;
        }
      }
    }

    return sum;
  }
}
