import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  private run(a: number): number {
    const registers = {
      a,
      b: 0,
    };

    for (let i = 0; i < this.lines.length; i += 1) {
      const line = this.lines[i];
      const [cmd, register, jmp] = line.split(/\s|,/gi).filter(Boolean);

      const r = register as "a" | "b";

      switch (cmd) {
        case "hlf":
          registers[r] /= 2;
          break;
        case "tpl":
          registers[r] *= 3;
          break;
        case "inc":
          registers[r] += 1;
          break;
        case "jmp":
          i += +register - 1;
          break;
        case "jie":
          if (registers[r] % 2 === 0) {
            i += +jmp - 1;
          }
          break;
        case "jio":
          if (registers[r] === 1) {
            i += +jmp - 1;
          }
          break;
      }
    }
    return registers.b;
  }

  public async part1(): Promise<string | number> {
    return this.run(0);
  }

  public async part2(): Promise<string | number> {
    return this.run(1);
  }
}
