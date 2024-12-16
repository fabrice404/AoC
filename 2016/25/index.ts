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

  private runProgram(a: number): number[] {
    const result: number[] = [];

    this.registers = { a, b: 0, c: 0, d: 0 };
    const program = this.lines.map((line) => line.split(" "));
    for (let i = 0; i < program.length && result.length < 100; i += 1) {
      const [cmd, x, y] = program[i];

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
        case "out":
          result.push(this.getRegister(x));
          break;
      }
    }
    return result;
  }

  public async part1(): Promise<string | number> {
    let a = 0;
    while (true) {
      const result = this.runProgram(a);
      if (result.join("") === "0101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101") {
        return a;
      }
      a += 1;
    }
  }

  public async part2(): Promise<string | number> {
    return "Happy Xmas!";
  }
}
