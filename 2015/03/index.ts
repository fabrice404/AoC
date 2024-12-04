import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  public async part1(): Promise<string | number> {
    const chars = this.input.split("");
    const visited = new Set<string>();

    const coords = [0, 0];
    visited.add(coords.join(","));

    for (const char of chars) {
      switch (char) {
        case "^":
          coords[1] += 1;
          break;
        case "v":
          coords[1] -= 1;
          break;
        case "<":
          coords[0] -= 1;
          break;
        case ">":
          coords[0] += 1;
          break;
        default:
          throw new Error(`Invalid character: ${char}`);
      }
      if (!visited.has(coords.join(","))) {
        visited.add(coords.join(","));
      }
    }

    return visited.size;
  }

  public async part2(): Promise<string | number> {
    const chars = this.input.split("");
    const visited = new Set<string>();

    const coords1 = [0, 0];
    const coords2 = [0, 0];
    visited.add(coords1.join(","));

    let i = 0;
    for (const char of chars) {
      switch (char) {
        case "^":
          (i % 2 === 0 ? coords1 : coords2)[1] += 1;
          break;
        case "v":
          (i % 2 === 0 ? coords1 : coords2)[1] -= 1;
          break;
        case "<":
          (i % 2 === 0 ? coords1 : coords2)[0] -= 1;
          break;
        case ">":
          (i % 2 === 0 ? coords1 : coords2)[0] += 1;
          break;
        default:
          throw new Error(`Invalid character: ${char}`);
      }
      if (!visited.has((i % 2 === 0 ? coords1 : coords2).join(","))) {
        visited.add((i % 2 === 0 ? coords1 : coords2).join(","));
      }
      i += 1;
    }

    return visited.size;
  }
}
