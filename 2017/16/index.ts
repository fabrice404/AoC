import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  private programs = "abcdefghijklmnop".split("");

  private dance() {
    for (const input of this.input.split(",")) {
      const action = input[0];
      const params = input.slice(1).split("/");

      switch (action) {
        case "s":
          const spin = +params[0];
          this.programs.unshift(...this.programs.splice(-spin));
          break;
        case "x":
          const [a, b] = params.map(Number);
          [this.programs[a], this.programs[b]] = [this.programs[b], this.programs[a]];
          break;
        case "p":
          const [x, y] = params;
          const xIndex = this.programs.indexOf(x);
          const yIndex = this.programs.indexOf(y);
          [this.programs[xIndex], this.programs[yIndex]] = [this.programs[yIndex], this.programs[xIndex]];
          break;
      }
    }
  }

  public async part1(): Promise<string | number> {
    this.dance();
    return this.programs.join("");
  }

  public async part2(): Promise<string | number> {
    this.programs = "abcdefghijklmnop".split("");

    const seen: string[] = [];
    for (let i = 0; i < 1_000_000_000; i++) {
      if (seen.includes(this.programs.join(""))) {
        return seen[1_000_000_000 % i];
      }

      seen.push(this.programs.join(""));
      this.dance();
    }

    return "";
  }
}
