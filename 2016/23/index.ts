import AoCPuzzle from "../../puzzle";

type Register = { [key: string]: number };

export default class Puzzle extends AoCPuzzle {
  private registers: Register = { a: 0, b: 0, c: 0, d: 0 };

  private getRegister(r: string | number): number {
    if (Number.isNaN(+r)) {
      return this.registers[r];
    }
    return +r;
  }

  private runProgram(): number {
    const program = this.lines.map((line) => line.split(" "));

    for (let i = 0; i < program.length && i < 10_000_000; i += 1) {
      const [cmd, x, y] = program[i];

      // console.log(i, program[i], this.registers);
      switch (cmd) {
        case "cpy":
          this.registers[y] = this.getRegister(x);
          break;
        case "inc":
          this.registers[x] += 1;
          break;
        case "dec":
          this.registers[x] -= 1;
          break;
        case "jnz":
          if (this.getRegister(x) !== 0) {
            i += this.getRegister(y) - 1;
          }
          break;
        case "tgl":
          const target = i + this.getRegister(x);
          if (target < 0 || target >= program.length) {
            break;
          }
          const [cmd2, , y2] = program[target];
          if (y2) {
            program[target][0] = cmd2 === "jnz" ? "cpy" : "jnz";
          } else {
            program[target][0] = cmd2 === "inc" ? "dec" : "inc";
          }
          break;
      }
    }

    return this.registers.a;
  }

  public async part1(): Promise<string | number> {
    this.registers = { a: 0, b: 0, c: 0, d: 0 };
    if (!this.isExample) {
      this.registers.a = 7;
    }
    return this.runProgram();
  }

  public async part2(): Promise<string | number> {
    this.registers = { a: 12, b: 0, c: 0, d: 0 };
    return this.runProgram();
  }
}
