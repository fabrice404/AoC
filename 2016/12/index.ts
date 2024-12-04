import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  private registers: Map<string, number> = new Map();

  private run(): number {
    for (let i = 0; i < this.lines.length; i += 1) {
      const line = this.lines[i];
      if (line.startsWith("cpy")) {
        const [, value, register] = line.split(/\s/gi);
        if (value.match(/\d/gi)) {
          this.registers.set(register, +value);
        } else {
          this.registers.set(register, this.registers.get(value) || 0);
        }
      } else if (line.startsWith("jnz")) {
        const [, register, offset] = line.match(/jnz (\w) (-?\d+)/)!;
        if (register.match(/\d/gi)) {
          if (+register !== 0) {
            i += +offset - 1;
          }
        } else if (!this.registers.has(register)) {
          this.registers.set(register, 0);
        } else if (this.registers.get(register) !== 0) {
          i += +offset - 1;
        }
      } else if (line.startsWith("inc")) {
        const [, register] = line.match(/inc (\w)/)!;
        this.registers.set(register, (this.registers.get(register) || 0) + 1);
      } else if (line.startsWith("dec")) {
        const [, register] = line.match(/dec (\w)/)!;
        this.registers.set(register, (this.registers.get(register) || 0) - 1);
      }
    }

    return this.registers.get("a")!;
  }

  public async part1(): Promise<string | number> {
    return this.run();
  }

  public async part2(): Promise<string | number> {
    this.registers = new Map([["c", 1]]);
    return this.run();
  }
}
