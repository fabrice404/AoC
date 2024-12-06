import { CardinalDirection, Direction, Point } from "../types";

export enum ConsoleColor {
  Black = 40,
  Red = 41,
  Green = 42,
  Yellow = 43,
  Blue = 44,
  Magenta = 45,
  Cyan = 46,
  White = 47,
}

export const waitSync = (ms: number) => {
  const start = Date.now();
  let now = start;
  while (now - start < ms) {
    now = Date.now();
  }
};

export const pointToKey = (p: Point): string => {
  if (p.z != null) {
    return `${p.x},${p.y},${p.z}`;
  }
  return `${p.x},${p.y}`;
};

export const keyToPoint = (key: string): Point => {
  const [x, y, z] = key.split(",").map(Number);
  if (z != null) {
    return { x, y, z };
  }
  return { x, y };
};

export const DIRECTIONS: Direction[] = ["U", "R", "D", "L"];
export const CARDINAL_DIRECTIONS: CardinalDirection[] = ["N", "E", "S", "W"];

export const moveTo = (p: Point, d: Direction): Point =>
  ({
    U: ({ x, y }: Point) => ({ x, y: y - 1 }),
    D: ({ x, y }: Point) => ({ x, y: y + 1 }),
    L: ({ x, y }: Point) => ({ x: x - 1, y }),
    R: ({ x, y }: Point) => ({ x: x + 1, y }),
  })[d](p);

export const moveToCardinal = (p: Point, d: CardinalDirection): Point =>
  ({
    N: ({ x, y }: Point) => ({ x, y: y - 1 }),
    S: ({ x, y }: Point) => ({ x, y: y + 1 }),
    W: ({ x, y }: Point) => ({ x: x - 1, y }),
    E: ({ x, y }: Point) => ({ x: x + 1, y }),
  })[d](p);
