import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  private presents50: number[] = [];

  public async part1(): Promise<string | number> {
    const n: number = +this.input;
    const presents: number[] = [];

    for (let elf = 1; elf < n / 10; elf += 1) {
      let v = 0;
      for (let h = elf; h < n / 10; h = h + elf) {
        if (presents[h] == null) {
          presents[h] = 10;
        }
        presents[h] += elf * 10;

        if (v < 50) {
          if (this.presents50[h] == null) {
            this.presents50[h] = 11;
          }
          this.presents50[h] += elf * 11;
          v += 1;
        }
      }
    }
    return presents.reduce((acc, current, i) => (acc === 0 && current >= n ? (acc = i) : acc), 0);
  }

  public async part2(): Promise<string | number> {
    return this.presents50.reduce((acc, current, i) => (acc === 0 && current >= +this.input ? (acc = i) : acc), 0);
  }
}
