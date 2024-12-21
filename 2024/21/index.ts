import { permutations, sum } from "../../helpers/array";
import AoCPuzzle from "../../puzzle";
import { Point } from "../../types";
import { DIRECTIONAL_KEYPAD, NUMERIC_KEYPAD } from "./keypads";

type NumericKeypadKey = "A" | "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9";
type DirectionalKeyPadKey = "A" | "^" | "<" | "v" | ">";

export default class Puzzle extends AoCPuzzle {
  private codeToNumericKeypadMoves(code: string) {
    let from: NumericKeypadKey = "A";
    let routes: string[] = [""];
    for (const to of code.split("") as NumericKeypadKey[]) {
      const moves = NUMERIC_KEYPAD[from][to];
      const perms = permutations(moves);
      routes = routes.map((route) => perms.map((p) => `${route}${p.join("")}A`)).flat();
      from = to;
    }
    return routes.filter((r) => this.isValidNumericKeypadRoute(r));
  }

  private isValidDirectionalKeypadRoute(m: string) {
    const position: Point = { x: 2, y: 0 };
    for (const to of m.split("") as DirectionalKeyPadKey[]) {
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
        // console.log(m, to, position);
        return false;
      }
    }

    return true;
  }

  private isValidNumericKeypadRoute(m: string) {
    const position: Point = { x: 2, y: 3 };
    for (const to of m.split("") as DirectionalKeyPadKey[]) {
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

    return true;
  }

  private keypadMovesToKeypadMoves(m: string) {
    let from: DirectionalKeyPadKey = "A";
    let routes: string[] = [""];
    for (const to of m.split("") as DirectionalKeyPadKey[]) {
      const moves = DIRECTIONAL_KEYPAD[from][to];
      const perms = permutations(moves);
      routes = routes.map((route) => perms.map((p) => `${route}${p.join("")}A`)).flat();
      from = to;
    }
    return routes.filter((r) => this.isValidDirectionalKeypadRoute(r));
  }

  private solve(directionalRobots: number = 2) {
    const results: number[] = [];
    for (const line of this.lines) {
      let routes = this.codeToNumericKeypadMoves(line);

      for (let i = 0; i < directionalRobots; i += 1) {
        const shortest = Math.min(...routes.map((r) => r.length));
        routes = routes
          .filter((r) => r.length === shortest)
          .map((r) => this.keypadMovesToKeypadMoves(r))
          .flat();
      }

      const shortestRoute = routes.sort((a, b) => (a.length > b.length ? 1 : -1))[0];

      console.log(shortestRoute.length, +line.replace(/[^\d]+/gi, ""), shortestRoute);
      results.push(shortestRoute.length * +line.replace(/[^\d]+/gi, ""));
    }
    console.log(results);
    return sum(results);
  }

  public async part1(): Promise<string | number> {
    return this.solve(2);
  }

  public async part2(): Promise<string | number> {
    // return this.solve(25);
    return "<NOT YET IMPLEMENTED>";
  }
}
