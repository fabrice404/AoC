import { Point } from "../types";

export const waitSync = (ms: number) => {
  const start = Date.now();
  let now = start;
  while (now - start < ms) {
    now = Date.now();
  }
}

export const pointToKey = (p: Point): string => {
  if (p.z != null) {
    return `${p.x},${p.y},${p.z}`;
  }
  return `${p.x},${p.y}`
};

export const keyToPoint = (key: string): Point => {
  const [x, y, z] = key.split(',').map(Number);
  if (z != null) {
    return { x, y, z };
  }
  return { x, y };
}
