import { sum } from "../../helpers/array";
import { memoize } from "../../helpers/memoize";
import AoCPuzzle from "../../puzzle";

const findPattern = memoize((towels: string[], pattern: string, current: string = "", i: number = 0): number => {
  if (current === pattern) {
    return 1;
  }
  if (current.length >= pattern.length) {
    return 0;
  }

  const candidates = towels.filter((t) => pattern.slice(i).startsWith(t));

  let results = 0;
  while (candidates.length > 0) {
    const candidate = candidates.pop()!;
    const result = findPattern(towels, pattern, current + candidate, current.length + candidate.length);
    results += result;
  }
  return results;
});

export default class Puzzle extends AoCPuzzle {
  private patterns: string[] = [];

  private towels: string[] = [];

  public async part1(): Promise<string | number> {
    this.towels = this.lines.shift()!.split(", ");
    this.patterns = this.lines.slice(1);
    return this.patterns.filter((p) => findPattern(this.towels, p)).length;
  }

  public async part2(): Promise<string | number> {
    return sum(this.patterns.map((p) => findPattern(this.towels, p)));
  }
}
