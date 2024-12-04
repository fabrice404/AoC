import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  private cleaned: string[] = [];

  public async part1(): Promise<string | number> {
    for (let i = 0; i < this.input.length; i += 1) {
      const char = this.input[i];
      if (char === "!") {
        i += 1;
      } else {
        this.cleaned.push(char);
      }
    }

    const cleanedString = this.cleaned.join("").replace(/<[^>]*>/g, "");
    const scores: number[] = [];
    let level = 0;
    for (let i = 0; i < cleanedString.length; i += 1) {
      const char = cleanedString[i];
      if (char === "{") {
        level += 1;
        scores.push(level);
      } else if (char === "}") {
        level -= 1;
      }
    }

    return scores.reduce((acc, val) => acc + val, 0);
  }

  public async part2(): Promise<string | number> {
    return this.cleaned.length - this.cleaned.join("").replace(/<[^>]*>/g, "<>").length;
  }
}
