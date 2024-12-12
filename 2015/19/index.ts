import { splice } from "../../helpers/string";
import AoCPuzzle from "../../puzzle";

type Replacements = { [key: string]: string[] };

export default class Puzzle extends AoCPuzzle {
  private formula: string = "";

  private replacements: Replacements = {};

  public async part1(): Promise<string | number> {
    this.formula = this.lines.pop()!;

    this.replacements = this.lines.filter(Boolean).reduce((acc, line) => {
      const [element, replacement] = line.split(" => ");
      acc[element] = [...(acc[element] || []), replacement];
      return acc;
    }, {} as Replacements);

    const matches = [];

    const rx = /([a-zA-Z][a-z]*)/g;
    let match;
    while ((match = rx.exec(this.formula)) !== null) {
      matches.push(match);
    }

    const result = matches
      .reduce((acc, match) => {
        const { index } = match;
        const element = match[0];

        if (this.replacements[element]) {
          this.replacements[element].forEach((replacement) => {
            acc.push(splice(this.formula, index, element.length, replacement));
          });
        }

        return acc;
      }, [] as string[])
      .filter((item, i, self) => self.indexOf(item) === i);

    return result.length;
  }

  public async part2(): Promise<string | number> {
    const reversed = Object.keys(this.replacements).reduce((map, key) => {
      this.replacements[key].forEach((element) => {
        map.set(element, key);
      });
      return map;
    }, new Map());

    let target = this.formula;
    let result = 0;

    while (target.length > 1) {
      for (const [element, replacement] of reversed.entries()) {
        if (target.includes(element)) {
          target = target.replace(element, replacement);
          result = result + 1;
        }
      }
    }

    return result;
  }
}
