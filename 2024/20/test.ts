import assert from "node:assert";
import { Point } from "../../types";
import { readFileSync } from "node:fs";
// import { ContinousGrid } from "../../common/continous-grid";
// import { Point } from "../../common/point";
// import { IGrid } from "../../common/grid";

export const clone = Symbol("clone");

export interface Cloneable<T> {
  [clone](): T;
}

export function isCloneable<T>(a: T): a is T & Cloneable<T> {
  return Boolean((a as any)[clone]);
}

interface IterationResult<T> {
  x: number;
  y: number;
  value: T;
}

export class ContinousGrid<T> {
  private _height: number;
  private _items: T[];
  private _width: number;

  constructor(width: number, height: number, items: T[]) {
    assert.equal(width * height, items.length);
    this._items = items;
    this._width = width;
    this._height = height;
  }

  public get height() {
    return this._height;
  }

  public get width() {
    return this._width;
  }

  public static parseCharGrid(input: string): ContinousGrid<string> {
    const ls = lines(input);
    const lengths = new Set(ls.map((line) => line.length));
    assert.equal(lengths.size, 1, "input is rectangle");
    const data = ls.join("");
    return new ContinousGrid(ls[0].length, ls.length, data.split(""));
  }

  public at(x: number, y: number) {
    if (x >= this._width || x < 0) {
      return null;
    }
    if (y >= this._height || y < 0) {
      return null;
    }
    return this._items[y * this._width + x] ?? null;
  }

  public clone(): ContinousGrid<T> {
    return new ContinousGrid(
      this._width,
      this._height,
      this._items.map((item) => (isCloneable(item) ? item[clone]() : item)),
    );
  }

  public [clone]() {
    return this.clone();
  }

  public set(x: number, y: number, value: T) {
    if (x >= this._width || x < 0) {
      throw new RangeError(`${x}:${y} is not a valid position on the grid`);
    }
    if (y >= this._height || y < 0) {
      throw new RangeError(`${x}:${y} is not a valid position on the grid`);
    }
    this._items[y * this._width + x] = value;
  }

  *[Symbol.iterator](): Generator<IterationResult<T>> {
    for (let x = 0; x < this.width; ++x) {
      for (let y = 0; y < this.height; ++y) {
        yield { x, y, value: this._items[y * this._width + x] };
      }
    }
  }

  public toString() {
    const lines = [];
    for (let y = 0; y < this.height; ++y) {
      let line = "";
      for (let x = 0; x < this.width; ++x) {
        line += this.at(x, y);
      }
      lines.push(line);
    }
    return lines.join("\n");
  }
}

export interface IGrid<T> {
  at(x: number, y: number): T | null;
  set(x: number, y: number, value: T): void;
  get width(): number;
  get height(): number;
  clone(): IGrid<T>;
}
export function lines(input: string) {
  return input
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

export class Grid implements IGrid<string> {
  private _chars: string[][];

  constructor(input: string) {
    this._chars = lines(input).map((line) =>
      line
        .split("")
        .map((c) => c.trim())
        .filter((c) => c.length > 0),
    );
    const lineLength = new Set(this._chars.map((l) => l.length));
    assert(lineLength.size === 1, "every line should have the same length");
  }

  public get height() {
    return this._chars.length;
  }

  public get width() {
    return this._chars[0].length;
  }

  public at(x: number, y: number): string | null {
    return this._chars[y]?.[x] ?? null;
  }

  public clone(): Grid {
    return new Grid(this._chars.map((line) => line.join("")).join("\n"));
  }

  public set(x: number, y: number, symbol: string): void {
    if ((this._chars[y]?.[x] ?? null) === null) {
      throw new RangeError(`${x}:${y} is not a valid position on the grid`);
    }
    this._chars[y][x] = symbol;
  }
}

function parse(input: string) {
  const grid = ContinousGrid.parseCharGrid(input);
  let start: Point | null = null;
  let end: Point | null = null;
  for (let x = 0; x < grid.width; ++x) {
    for (let y = 0; y < grid.height; ++y) {
      if (grid.at(x, y) === "S") {
        start = { x, y };
      } else if (grid.at(x, y) === "E") {
        end = { x, y };
      }
    }
  }

  assert(start, "there is start");
  assert(end, "there is finish");

  return { grid, start, end };
}

function posKey(position: Point) {
  return `${position.x}:${position.y}`;
}

interface DistanceFillEntry {
  x: number;
  y: number;
  current: number;
}

function fillDistances(grid: IGrid<string>, from: Point) {
  const distanceGrid = new ContinousGrid<number>(grid.width, grid.height, Array(grid.width * grid.height).fill(Infinity));
  distanceGrid.set(from.x, from.y, 0);
  let queue: DistanceFillEntry[] = [{ x: from.x, y: from.y, current: 0 }];
  while (queue.length) {
    const next = new Map<string, DistanceFillEntry>();
    for (const entry of queue) {
      const up = {
        x: entry.x,
        y: entry.y - 1,
        current: entry.current + 1,
      };
      const down = {
        x: entry.x,
        y: entry.y + 1,
        current: entry.current + 1,
      };
      const left = {
        x: entry.x - 1,
        y: entry.y,
        current: entry.current + 1,
      };
      const right = {
        x: entry.x + 1,
        y: entry.y,
        current: entry.current + 1,
      };

      for (const neighbour of [up, down, left, right]) {
        if (neighbour.x < 0 || neighbour.y < 0 || neighbour.x >= grid.width || neighbour.y >= grid.height) {
          continue;
        }
        if (grid.at(neighbour.x, neighbour.y) === "#") {
          continue;
        }
        const currentDistance = distanceGrid.at(neighbour.x, neighbour.y) ?? Infinity;
        if (neighbour.current >= currentDistance) {
          continue;
        }
        distanceGrid.set(neighbour.x, neighbour.y, neighbour.current);
        next.set(posKey(neighbour), neighbour);
      }
    }
    queue = [...next.values()];
  }

  return distanceGrid;
}

function calculateCheat(path: [Point, Point], endDistances: IGrid<number>) {
  const startDistance = endDistances.at(path[0].x, path[0].y);
  const endDistance = endDistances.at(path[1].x, path[1].y);
  if (startDistance === null || startDistance === Infinity || endDistance === null || endDistance === Infinity) {
    return null;
  }

  const cheated = Math.abs(path[0].x - path[1].x) + Math.abs(path[0].y - path[1].y);
  const uncheated = startDistance - endDistance;
  // console.log({ x: path[0].x, y: path[0].y, ex: path[1].x, ey: path[1].y, saving: uncheated - cheated, cheated, uncheated });
  return uncheated - cheated;
}

function solve(grid: IGrid<string>, start: Point, end: Point, max: number) {
  const distances = fillDistances(grid, end);
  // console.log(distances);

  let count = 0;
  for (let x = 0; x < grid.width; ++x) {
    for (let y = 0; y < grid.height; ++y) {
      if (distances.at(x, y) === null || distances.at(x, y) === Infinity) {
        continue;
      }
      for (let ex = x - max; ex < x + max + 1; ++ex) {
        for (let ey = y - max; ey < y + max + 1; ++ey) {
          if (distances.at(ex, ey) === null || distances.at(ex, ey) === Infinity) {
            continue;
          }
          const totalDistance = Math.abs(x - ex) + Math.abs(y - ey);
          if (totalDistance > max) {
            continue;
          }
          const saving = calculateCheat(
            [
              { x, y },
              { x: ex, y: ey },
            ],
            distances,
          );
          if (saving === null || saving < 100) {
            continue;
          }
          count++;
        }
      }
    }
  }

  return count;
}

export function partOne(input: string) {
  const { grid, start, end } = parse(input);
  return solve(grid, start, end, 2);
}

export function partTwo(input: string) {
  const { grid, start, end } = parse(input);
  return solve(grid, start, end, 20);
}

const input = readFileSync("./2024/20/input.txt", "utf-8");

console.log(partOne(input), partTwo(input));
