import AoCPuzzle from "../../puzzle";

interface Sue {
  id: number;
  children?: number;
  cats?: number;
  samoyeds?: number;
  pomeranians?: number;
  akitas?: number;
  vizslas?: number;
  goldfish?: number;
  trees?: number;
  cars?: number;
  perfumes?: number;
}

type SueProperty = "children" | "cats" | "samoyeds" | "pomeranians" | "akitas" | "vizslas" | "goldfish" | "trees" | "cars" | "perfumes";

export default class Puzzle extends AoCPuzzle {
  private sues: Sue[] = [];

  public async part1(): Promise<string | number> {
    this.sues = this.lines.map((line) => {
      const id = +line.slice(0, line.indexOf(":")).replace(/[^0-9]/gi, "");
      const items = line.slice(line.indexOf(":") + 2).split(", ");
      const sue: Sue = { id };
      for (const item of items) {
        const [name, quantity] = item.split(": ");
        sue[name as SueProperty] = +quantity;
      }

      return sue;
    });

    return this.sues.find(
      (s) =>
        (s.children ?? 3) === 3 &&
        (s.cats ?? 7) === 7 &&
        (s.samoyeds ?? 2) === 2 &&
        (s.pomeranians ?? 3) === 3 &&
        (s.akitas ?? 0) === 0 &&
        (s.vizslas ?? 0) === 0 &&
        (s.goldfish ?? 5) === 5 &&
        (s.trees ?? 3) === 3 &&
        (s.cars ?? 2) === 2 &&
        (s.perfumes ?? 1) === 1,
    )!.id;
  }

  public async part2(): Promise<string | number> {
    return this.sues.find(
      (s) =>
        (s.children ?? 3) === 3 &&
        (s.cats ?? 8) > 7 &&
        (s.samoyeds ?? 2) === 2 &&
        (s.pomeranians ?? 2) < 3 &&
        (s.akitas ?? 0) === 0 &&
        (s.vizslas ?? 0) === 0 &&
        (s.goldfish ?? 4) < 5 &&
        (s.trees ?? 4) > 3 &&
        (s.cars ?? 2) === 2 &&
        (s.perfumes ?? 1) === 1,
    )!.id;
  }
}
