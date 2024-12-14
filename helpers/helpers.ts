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

/**
 * Sychronous wait for a number of milliseconds, useful for debugging
 * @param ms
 */
export const waitSync = (ms: number) => {
  const start = Date.now();
  let now = start;
  while (now - start < ms) {
    now = Date.now();
  }
};

/**
 * Converts a Point to a string key, useful for storing in a map.
 * @param {Point} p - The point to convert.
 * @returns {string} The string key representation of the point.
 */
export const pointToKey = (p: Point): string => {
  if (p.z != null) {
    return `${p.x},${p.y},${p.z}`;
  }
  return `${p.x},${p.y}`;
};

/**
 * Converts a string key to a Point.
 * @param {string} key - The string key to convert.
 * @returns {Point} The point representation of the string key.
 */
export const keyToPoint = (key: string): Point => {
  const [x, y, z] = key.split(",").map(Number);
  if (z != null) {
    return { x, y, z };
  }
  return { x, y };
};

export const DIRECTIONS: Direction[] = ["U", "R", "D", "L"];
export const CARDINAL_DIRECTIONS: CardinalDirection[] = ["N", "E", "S", "W"];

/**
 * Given a point and a direction, returns the new point after moving in that direction.
 * @param {Point} p - The starting point.
 * @param {Direction} d - The direction to move in.
 * @returns {Point} The new point after moving in the specified direction.
 */
export const moveTo = (p: Point, d: Direction): Point =>
  ({
    U: ({ x, y }: Point) => ({ x, y: y - 1 }),
    D: ({ x, y }: Point) => ({ x, y: y + 1 }),
    L: ({ x, y }: Point) => ({ x: x - 1, y }),
    R: ({ x, y }: Point) => ({ x: x + 1, y }),
  })[d](p);

/**
 * Given a point and a cardinal direction, returns the new point after moving in that direction.
 * @param {Point} p - The starting point.
 * @param {CardinalDirection} d - The cardinal direction to move in.
 * @returns {Point} The new point after moving in the specified cardinal direction.
 */
export const moveToCardinal = (p: Point, d: CardinalDirection): Point =>
  ({
    N: ({ x, y }: Point) => ({ x, y: y - 1 }),
    S: ({ x, y }: Point) => ({ x, y: y + 1 }),
    W: ({ x, y }: Point) => ({ x: x - 1, y }),
    E: ({ x, y }: Point) => ({ x: x + 1, y }),
  })[d](p);
