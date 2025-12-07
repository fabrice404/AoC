import AoCPuzzle from "../../puzzle";

type Command = "addr" | "addi" | "mulr" | "muli" | "banr" | "bani" | "borr" | "bori" | "setr" | "seti" | "gtir" | "gtri" | "gtrr" | "eqir" | "eqri" | "eqrr";

interface Instruction {
  command: Command;
  a: number;
  b: number;
  c: number;
}

export default class Puzzle extends AoCPuzzle {
  private registers = [0, 0, 0, 0, 0, 0];

  private commands = {
    addr: (instruction: Instruction) => {
      this.registers[instruction.c] = this.registers[instruction.a] + this.registers[instruction.b];
    },
    addi: (instruction: Instruction) => {
      this.registers[instruction.c] = this.registers[instruction.a] + instruction.b;
    },
    mulr: (instruction: Instruction) => {
      this.registers[instruction.c] = this.registers[instruction.a] * this.registers[instruction.b];
    },
    muli: (instruction: Instruction) => {
      this.registers[instruction.c] = this.registers[instruction.a] * instruction.b;
    },
    banr: (instruction: Instruction) => {
      this.registers[instruction.c] = this.registers[instruction.a] & this.registers[instruction.b];
    },
    bani: (instruction: Instruction) => {
      this.registers[instruction.c] = this.registers[instruction.a] & instruction.b;
    },
    borr: (instruction: Instruction) => {
      this.registers[instruction.c] = this.registers[instruction.a] | this.registers[instruction.b];
    },
    bori: (instruction: Instruction) => {
      this.registers[instruction.c] = this.registers[instruction.a] | instruction.b;
    },
    setr: (instruction: Instruction) => {
      this.registers[instruction.c] = this.registers[instruction.a];
    },
    seti: (instruction: Instruction) => {
      this.registers[instruction.c] = instruction.a;
    },
    gtir: (instruction: Instruction) => {
      this.registers[instruction.c] = instruction.a > this.registers[instruction.b] ? 1 : 0;
    },
    gtri: (instruction: Instruction) => {
      this.registers[instruction.c] = this.registers[instruction.a] > instruction.b ? 1 : 0;
    },
    gtrr: (instruction: Instruction) => {
      this.registers[instruction.c] = this.registers[instruction.a] > this.registers[instruction.b] ? 1 : 0;
    },
    eqir: (instruction: Instruction) => {
      this.registers[instruction.c] = instruction.a === this.registers[instruction.b] ? 1 : 0;
    },
    eqri: (instruction: Instruction) => {
      this.registers[instruction.c] = this.registers[instruction.a] === instruction.b ? 1 : 0;
    },
    eqrr: (instruction: Instruction) => {
      this.registers[instruction.c] = this.registers[instruction.a] === this.registers[instruction.b] ? 1 : 0;
    },
  };

  private instructionPointer = 0;

  private program: Instruction[] = [];

  private outputProgram(): void {
    this.program.forEach(({ command, a, b, c }, index) => {
      const i = index.toString().padStart(2, "0");
      switch (command) {
        case "addr":
          console.log(`${i}: reg[${c}] = reg[${a}] + reg[${b}]`);
          break;
        case "addi":
          console.log(`${i}: reg[${c}] = reg[${a}] + ${b}`);
          break;
        case "mulr":
          console.log(`${i}: reg[${c}] = reg[${a}] * reg[${b}]`);
          break;
        case "muli":
          console.log(`${i}: reg[${c}] = reg[${a}] * ${b}`);
          break;
        case "banr":
          console.log(`${i}: reg[${c}] = reg[${a}] & reg[${b}]`);
          break;
        case "bani":
          console.log(`${i}: reg[${c}] = reg[${a}] & ${b}`);
          break;
        case "borr":
          console.log(`${i}: reg[${c}] = reg[${a}] | reg[${b}]`);
          break;
        case "bori":
          console.log(`${i}: reg[${c}] = reg[${a}] | ${b}`);
          break;
        case "setr":
          console.log(`${i}: reg[${c}] = reg[${a}]`);
          break;
        case "seti":
          console.log(`${i}: reg[${c}] = ${a}`);
          break;
        case "gtir":
          console.log(`${i}: reg[${c}] = ${a} > reg[${b}] ? 1 : 0`);
          break;
        case "gtri":
          console.log(`${i}: reg[${c}] = reg[${a}] > ${b} ? 1 : 0`);
          break;
        case "gtrr":
          console.log(`${i}: reg[${c}] = reg[${a}] > reg[${b}] ? 1 : 0`);
          break;
        case "eqir":
          console.log(`${i}: reg[${c}] = ${a} === reg[${b}] ? 1 : 0`);
          break;
        case "eqri":
          console.log(`${i}: reg[${c}] = reg[${a}] === ${b} ? 1 : 0`);
          break;
        case "eqrr":
          console.log(`${i}: reg[${c}] = reg[${a}] === reg[${b}] ? 1 : 0`);
          break;
      }
    });
  }

  public async part1(): Promise<string | number> {
    this.instructionPointer = parseInt(this.lines.shift()!.replace("#ip ", ""), 10);

    this.program = this.lines.map((line) => {
      const [command, a, b, c] = line.split(/\s/gi);
      return {
        command,
        a: parseInt(a, 10),
        b: parseInt(b, 10),
        c: parseInt(c, 10),
      } as Instruction;
    });

    while (0 <= this.registers[this.instructionPointer] && this.registers[this.instructionPointer] < this.program.length) {
      const instruction = this.program[this.registers[this.instructionPointer]];

      this.commands[instruction.command](instruction);
      this.registers[this.instructionPointer] = this.registers[this.instructionPointer] + 1;
    }
    return this.registers[0];
  }

  public async part2(): Promise<string | number> {
    this.resetInput();
    this.registers = [1, 0, 0, 0, 0, 0];

    this.instructionPointer = parseInt(this.lines.shift()!.replace("#ip ", ""), 10);

    this.program = this.lines.map((line) => {
      const [command, a, b, c] = line.split(/\s/gi);
      return {
        command,
        a: parseInt(a, 10),
        b: parseInt(b, 10),
        c: parseInt(c, 10),
      } as Instruction;
    });

    let cycles = 0;
    while (0 <= this.registers[this.instructionPointer] && this.registers[this.instructionPointer] < this.program.length) {
      const instruction = this.program[this.registers[this.instructionPointer]];

      this.commands[instruction.command](instruction);
      this.registers[this.instructionPointer] = this.registers[this.instructionPointer] + 1;

      if (cycles >= 500) {
        break;
      }
      cycles += 1;
    }

    const max = Math.max(...this.registers);
    let result = 0;
    for (let i = 0; i <= max + 1; i += 1) {
      if (max % i === 0) {
        result += i;
      }
    }

    return result;
  }
}
