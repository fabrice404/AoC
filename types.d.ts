export interface Point {
  x: number;
  y: number;
  z?: number;
}

export type Direction = "U" | "R" | "D" | "L";

export type CardinalDirection = "N" | "E" | "S" | "W";

export interface Step {
  point: Point;
  direction: Direction;
}
