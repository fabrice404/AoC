import AoCPuzzle from "../../puzzle";

type Register = { [key: string]: number };

interface Program {
  registers: Register;
  deadlocked: boolean;
  sent: any[];
  received: any[];
  i: number;
}

interface Programs {
  a: Program;
  b: Program;
}

export default class Puzzle extends AoCPuzzle {
  private programs: Programs = {
    a: { registers: { p: 0 }, deadlocked: false, sent: [], received: [], i: 0 },
    b: { registers: { p: 1 }, deadlocked: false, sent: [], received: [], i: 0 },
  };

  private registers: Register = {};

  private getProgramRegister(program: "a" | "b", r: string | number): number {
    if (Number.isNaN(+r)) {
      return this.programs[program].registers[r];
    }
    return +r;
  }

  private getRegister(r: string | number): number {
    if (Number.isNaN(+r)) {
      return this.registers[r];
    }
    return +r;
  }

  private runProgram(program: "a" | "b") {
    const destination = program === "a" ? "b" : "a";
    if (this.programs[program].deadlocked) {
      return;
    }

    for (let i = this.programs[program].i; i < this.lines.length; i += 1) {
      this.programs[program].i = i;

      const [cmd, x, y] = this.lines[i].split(/\s/gi);
      switch (cmd) {
        case "snd":
          const value = this.getProgramRegister(program, x);
          this.programs[program].sent.push(value);
          this.programs[destination].received.push(value);
          this.programs[destination].deadlocked = false;
          break;
        case "set":
          this.programs[program].registers[x] = this.getProgramRegister(program, y);
          break;
        case "add":
          this.programs[program].registers[x] += this.getProgramRegister(program, y);
          break;
        case "mul":
          this.programs[program].registers[x] *= this.getProgramRegister(program, y);
          break;
        case "mod":
          this.programs[program].registers[x] %= this.getProgramRegister(program, y);
          break;
        case "rcv":
          if (this.programs[program].received.length === 0) {
            this.programs[program].deadlocked = true;
            return;
          }
          this.programs[program].registers[x] = this.programs[program].received.shift();
          break;
        case "jgz":
          if (this.getProgramRegister(program, x) > 0) {
            i += this.getProgramRegister(program, y) - 1;
            this.programs[program].i = i;
          }
          break;
      }
    }
  }

  public async part1(): Promise<string | number> {
    const soundPlayed: number[] = [];
    for (let i = 0; i < this.lines.length; i += 1) {
      const [cmd, x, y] = this.lines[i].split(/\s/gi);

      switch (cmd) {
        case "snd":
          soundPlayed.push(this.getRegister(x));
          break;
        case "set":
          this.registers[x] = this.getRegister(y);
          break;
        case "add":
          this.registers[x] += this.getRegister(y);
          break;
        case "mul":
          this.registers[x] *= this.getRegister(y);
          break;
        case "mod":
          this.registers[x] %= this.getRegister(y);
          break;
        case "rcv":
          if (this.getRegister(x) !== 0) {
            return soundPlayed[soundPlayed.length - 1];
          }
          break;
        case "jgz":
          if (this.getRegister(x) > 0) {
            i += this.getRegister(y) - 1;
          }
          break;
      }
    }

    return -1;
  }

  public async part2(): Promise<string | number> {
    while (!this.programs.a.deadlocked || !this.programs.b.deadlocked) {
      this.runProgram("a");
      this.runProgram("b");
    }

    return this.programs.b.sent.length;
  }
}
