import { sum } from "../../helpers/array";
import AoCPuzzle from "../../puzzle";

interface Rule {
  a: number;
  b: number;
}

export default class Puzzle extends AoCPuzzle {
  private pages: number[][] = [];

  private rules: Rule[] = [];

  private fixOrder(pages: number[]): number {
    const ruleset = this.rules.filter((rule) => pages.includes(rule.a) && pages.includes(rule.b));
    while (!this.isOrderValid(pages)) {
      for (const rule of ruleset) {
        const { a, b } = rule;
        const indexA = pages.indexOf(a);
        const indexB = pages.indexOf(b);

        if (indexA > indexB) {
          pages[indexA] = b;
          pages[indexB] = a;
        }
      }
    }
    return this.isOrderValid(pages);
  }

  private isOrderValid(pages: number[]): number {
    for (let i = 0; i < pages.length - 1; i += 1) {
      const a = pages[i];
      const b = pages[i + 1];
      if (this.rules.find((rule) => rule.a === b && rule.b === a)) {
        return 0;
      }
    }
    return pages[Math.floor(pages.length / 2)];
  }

  public async part1(): Promise<string | number> {
    for (const line of this.lines) {
      if (line.includes("|")) {
        const [a, b] = line.split("|").map(Number);
        this.rules.push({ a, b });
      } else if (line.includes(",")) {
        this.pages.push(line.split(",").map(Number));
      }
    }

    return sum(this.pages.map((pages) => this.isOrderValid(pages)));
  }

  public async part2(): Promise<string | number> {
    return sum(this.pages.filter((pages) => !this.isOrderValid(pages)).map((pages) => this.fixOrder(pages)));
  }
}
