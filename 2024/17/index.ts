import AoCPuzzle from "../../puzzle";

interface Register {
  A: bigint;
  B: bigint;
  C: bigint;
}

export default class Puzzle extends AoCPuzzle {
  private program: number[] = [];

  private registers: Register = { A: 0n, B: 0n, C: 0n };

  private checkOpCode(a: bigint, level: number = this.program.length - 1): bigint {
    if (level < 0) {
      return a;
    }
    const target = this.program[level];
    const start = a * 8n;

    for (let nextA = start; nextA < start + 8n; nextA += 1n) {
      const output = this.run(nextA, 0n, 0n);

      if (output[0] === target) {
        const result = this.checkOpCode(nextA, level - 1);
        if (result >= 0n) {
          return result;
        }
      }
    }
    return -1n;
  }

  private run(a: bigint, b: bigint, c: bigint): number[] {
    this.registers.A = a;
    this.registers.B = b;
    this.registers.C = c;

    const result: number[] = [];

    for (let i = 0; i < this.program.length && result.length < 100; i += 2) {
      const opcode = this.program[i];
      const operand = BigInt(this.program[i + 1]);
      let combo = operand;
      if (operand === 4n) {
        combo = this.registers.A;
      } else if (operand === 5n) {
        combo = this.registers.B;
      } else if (operand === 6n) {
        combo = this.registers.C;
      } else if (operand > 6) {
        throw new Error(`combo needs to be set!`);
      }

      switch (opcode) {
        case 0: // adv
          this.registers.A = this.registers.A >> combo;
          break;

        case 1: // bxl
          this.registers.B = this.registers.B ^ operand;
          break;

        case 2: // bst
          this.registers.B = combo % 8n;
          break;

        case 3: // jnz
          if (this.registers.A !== 0n) {
            i = +`${operand}` - 2;
          }
          break;

        case 4: // bxc
          this.registers.B = this.registers.B ^ this.registers.C;
          break;

        case 5: // out
          result.push(+`${combo % 8n}`);
          break;

        case 6: // bdv
          this.registers.B = this.registers.A >> combo;
          break;

        case 7: // cdv
          this.registers.C = this.registers.A >> combo;
          break;
      }
    }

    return result;
  }

  public async part1(): Promise<string | number> {
    const a = BigInt(+this.lines.shift()!.replace("Register A: ", ""));
    const b = BigInt(+this.lines.shift()!.replace("Register B: ", ""));
    const c = BigInt(+this.lines.shift()!.replace("Register C: ", ""));

    this.program = this.lines.pop()!.replace("Program: ", "").split(",").map(Number);
    return this.run(a, b, c).join(",");
  }

  public async part2(): Promise<string | number> {
    if (this.isExample) {
      this.program = this.lines.pop()!.replace("Program: ", "").split(",").map(Number);
    }
    return this.checkOpCode(0n).toString();
  }
}
