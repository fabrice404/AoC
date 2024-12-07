import { sum } from "../../helpers/array";
import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  private cache: Map<string, number> = new Map<string, number>();

  private calculate(n: number[], total: number, operatorsCount: number = 2): number {
    for (let i = 0; i < operatorsCount ** n.length; i += 1) {
      const operators = this.decimalToBaseNToOperator(i, n.length - 1, operatorsCount);
      const parts = n.map((n: number, i: number) => (i === 0 ? `${n}` : `${operators[i - 1]}${n}`));
      if (this.calculateWithCache(parts) === total) {
        return total;
      }
    }
    return 0;
  }

  private calculateWithCache(parts: string[]): number {
    if (parts.length === 1) {
      return +parts[0];
    }
    const calculation = parts.join("");
    if (this.cache.has(calculation)) {
      return this.cache.get(calculation)!;
    } else {
      const current = parts.pop();
      const result = eval(`${this.calculateWithCache(parts)}${current}`);
      this.cache.set(calculation, result);
      return result;
    }
  }

  private decimalToBaseNToOperator(d: number, l: number, base: number): string[] {
    return d
      .toString(base)
      .padStart(l, "0")
      .split("")
      .map((s) => (s === "0" ? "+" : s === "1" ? "*" : ""));
  }

  public async part1(): Promise<string | number> {
    return sum(
      this.lines.map((line) => {
        const [total, ...n] = line.replace(":", "").split(/\s/g).map(Number);
        return this.calculate(n, total, 2);
      }),
    );
  }

  public async part2(): Promise<string | number> {
    return sum(
      this.lines.map((line) => {
        const [total, ...n] = line.replace(":", "").split(/\s/g).map(Number);
        return this.calculate(n, total, 3);
      }),
    );
  }
}
