import { sum } from "../../helpers/array";
import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  private cache: Map<string, number> = new Map<string, number>();

  private calculate(n: number[], total: number, operatorsCount: number = 2): number {
    for (let i = 0; i < operatorsCount ** n.length; i += 1) {
      const operators = operatorsCount === 2 ? this.decimalToBinaryToOperator(i, n.length - 1) : this.decimalToTernaryToOperator(i, n.length - 1);
      const numbers = [...n];
      let result = numbers.shift();
      while (numbers.length > 0) {
        const operator = operators.shift();
        let operation;
        if (operator === "||") {
          operation = `${result}${numbers.shift()}`;
        } else {
          operation = `${result} ${operator} ${numbers.shift()}`;
        }

        // do it the other way, calculate the full string, and then remove numbers from right to left to check cache before calculating.
        // if a+b+c+d is in cache, no need to check for a+b and a+b+c
        if (this.cache.has(operation)) {
          result = this.cache.get(operation);
        } else {
          result = eval(operation);
          this.cache.set(operation, result!);
        }
      }
      if (result === total) {
        return total;
      }
    }
    return 0;
  }

  private decimalToBinaryToOperator(d: number, l: number): string[] {
    return d
      .toString(2)
      .toString()
      .padStart(l, "0")
      .split("")
      .map((s) => (s === "0" ? "+" : "*"));
  }

  private decimalToTernaryToOperator(d: number, l: number): string[] {
    return d
      .toString(3)
      .toString()
      .padStart(l, "0")
      .split("")
      .map((s) => (s === "0" ? "+" : s === "1" ? "*" : "||"));
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
