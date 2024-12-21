import { permutations, sum } from "../../helpers/array";
import { memoize } from "../../helpers/memoize";
import AoCPuzzle from "../../puzzle";
import { Point } from "../../types";
import { DIRECTIONAL_KEYPAD, NUMERIC_KEYPAD } from "./keypads";

type NumericKeypadKey = "A" | "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
type DirectionalKeyPadKey = "A" | "^" | "<" | "v" | ">";

interface Keypad {
  [key: string]: { [key: string]: string[] | Point };
}

const isValidRoute = memoize((route: string[], from: string, isNumericKeypad: boolean): boolean => {
  if (isNumericKeypad) {
    const position = { ...NUMERIC_KEYPAD[from as NumericKeypadKey].position };
    for (const to of route as DirectionalKeyPadKey[]) {
      switch (to) {
        case "<":
          position.x -= 1;
          break;
        case ">":
          position.x += 1;
          break;
        case "^":
          position.y -= 1;
          break;
        case "v":
          position.y += 1;
          break;
      }
      if (position.x < 0 || position.y < 0 || position.x > 2 || position.y > 3 || (position.x === 0 && position.y === 3)) {
        return false;
      }
    }
  } else {
    const position = { ...DIRECTIONAL_KEYPAD[from as DirectionalKeyPadKey].position };
    for (const to of route as DirectionalKeyPadKey[]) {
      switch (to) {
        case "<":
          position.x -= 1;
          break;
        case ">":
          position.x += 1;
          break;
        case "^":
          position.y -= 1;
          break;
        case "v":
          position.y += 1;
          break;
      }
      if (position.x < 0 || position.y < 0 || position.x > 2 || position.y > 1 || (position.x === 0 && position.y === 0)) {
        return false;
      }
    }
  }
  return true;
});

const getKeysCount = memoize((code: string, robot: number, pad: Keypad) => {
  let from = "A";
  let length = 0;
  for (const to of code.split("")) {
    const moves = permutations((pad[from][to] as string[]) || [])
      .map((route) => [...route, "A"])
      .filter((route) => isValidRoute(route, from, Object.keys(pad).length > 5));

    if (robot === 0) {
      length += moves[0].length;
    } else {
      const lengths = moves.map((route) => getKeysCount(route.join(""), robot - 1, DIRECTIONAL_KEYPAD));
      length += Math.min(...lengths);
    }
    from = to;
  }
  return length;
});

export default class Puzzle extends AoCPuzzle {
  private solve(directionalRobots: number = 2) {
    const results: number[] = [];
    for (const line of this.lines) {
      const shortestRoute = getKeysCount(line, directionalRobots, NUMERIC_KEYPAD);
      results.push(shortestRoute * +line.replace(/[^\d]+/gi, ""));
    }
    return sum(results);
  }

  public async part1(): Promise<string | number> {
    return this.solve(2);
  }

  public async part2(): Promise<string | number> {
    return this.solve(25);
  }
}
