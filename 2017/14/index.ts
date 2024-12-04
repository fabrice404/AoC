import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  public async part1(): Promise<string | number> {
    const { default: KnotHasher } = await import("../10");

    this.grid = [];
    const knotHasher = new KnotHasher("", this.isExample);
    for (let i = 0; i < 128; i += 1) {
      const input = `${this.input}-${i}`;
      const hash = knotHasher.knotHash(input);
      const bits = hash
        .split("")
        .map((char) => parseInt(char, 16).toString(2).padStart(4, "0"))
        .join("")
        .split("");
      this.grid.push(bits);
    }
    return this.grid.map((row) => row.filter((c) => c === "1").length).reduce((acc, val) => acc + val, 0);
  }

  private group(x: number, y: number): void {
    if (x < 0 || x >= 128 || y < 0 || y >= 128 || this.grid[y][x] !== "1") {
      return;
    }

    this.grid[y][x] = " ";

    this.group(x, y - 1);
    this.group(x + 1, y);
    this.group(x, y + 1);
    this.group(x - 1, y);
  }

  public async part2(): Promise<string | number> {
    let groups = 0;
    for (let y = 0; y < 128; y += 1) {
      for (let x = 0; x < 128; x += 1) {
        if (this.grid[y][x] === "1") {
          this.group(x, y);
          groups += 1;
        }
      }
    }

    return groups;
  }
}
