 

import AoCPuzzle from '../../puzzle';

interface Sample {
  before: number[];
  instruction: number[];
  after: number[];
  validOpcodes?: string[];
}

export default class Puzzle extends AoCPuzzle {
  private samples: Sample[] = [];

  private program: number[][] = [];

  private operations: { [key: string]: Function } = {
    addr: ({ before, instruction, after }: Sample) => (after[instruction[3]] === (before[instruction[1]] + before[instruction[2]])),
    addi: ({ before, instruction, after }: Sample) => (after[instruction[3]] === (before[instruction[1]] + instruction[2])),
    mulr: ({ before, instruction, after }: Sample) => (after[instruction[3]] === (before[instruction[1]] * before[instruction[2]])),
    muli: ({ before, instruction, after }: Sample) => (after[instruction[3]] === (before[instruction[1]] * instruction[2])),
    banr: ({ before, instruction, after }: Sample) => (after[instruction[3]] === (before[instruction[1]] & before[instruction[2]])),
    bani: ({ before, instruction, after }: Sample) => (after[instruction[3]] === (before[instruction[1]] & instruction[2])),
    borr: ({ before, instruction, after }: Sample) => (after[instruction[3]] === (before[instruction[1]] | before[instruction[2]])),
    bori: ({ before, instruction, after }: Sample) => (after[instruction[3]] === (before[instruction[1]] | instruction[2])),
    setr: ({ before, instruction, after }: Sample) => (after[instruction[3]] === before[instruction[1]]),
    seti: ({ instruction, after }: Sample) => (after[instruction[3]] === instruction[1]),
    gtir: ({ before, instruction, after }: Sample) => (after[instruction[3]] === (instruction[1] > before[instruction[2]] ? 1 : 0)),
    gtri: ({ before, instruction, after }: Sample) => (after[instruction[3]] === (before[instruction[1]] > instruction[2] ? 1 : 0)),
    gtrr: ({ before, instruction, after }: Sample) => (after[instruction[3]] === ((before[instruction[1]] > before[instruction[2]]) ? 1 : 0)),
    eqir: ({ before, instruction, after }: Sample) => (after[instruction[3]] === (instruction[1] === before[instruction[2]] ? 1 : 0)),
    eqri: ({ before, instruction, after }: Sample) => (after[instruction[3]] === (before[instruction[1]] === instruction[2] ? 1 : 0)),
    eqrr: ({ before, instruction, after }: Sample) => (after[instruction[3]] === ((before[instruction[1]] === before[instruction[2]]) ? 1 : 0)),
  };

  private execute: { [key: string]: Function } = {
    addr: (instruction: number[], registers: number[]) => { registers[instruction[3]] = (registers[instruction[1]] + registers[instruction[2]]); },
    addi: (instruction: number[], registers: number[]) => { registers[instruction[3]] = (registers[instruction[1]] + instruction[2]); },
    mulr: (instruction: number[], registers: number[]) => { registers[instruction[3]] = (registers[instruction[1]] * registers[instruction[2]]); },
    muli: (instruction: number[], registers: number[]) => { registers[instruction[3]] = (registers[instruction[1]] * instruction[2]); },
    banr: (instruction: number[], registers: number[]) => { registers[instruction[3]] = (registers[instruction[1]] & registers[instruction[2]]); },
    bani: (instruction: number[], registers: number[]) => { registers[instruction[3]] = (registers[instruction[1]] & instruction[2]); },
    borr: (instruction: number[], registers: number[]) => { registers[instruction[3]] = (registers[instruction[1]] | registers[instruction[2]]); },
    bori: (instruction: number[], registers: number[]) => { registers[instruction[3]] = (registers[instruction[1]] | instruction[2]); },
    setr: (instruction: number[], registers: number[]) => { registers[instruction[3]] = registers[instruction[1]]; },
    seti: (instruction: number[], registers: number[]) => { registers[instruction[3]] = instruction[1]; },  
    gtir: (instruction: number[], registers: number[]) => { registers[instruction[3]] = (instruction[1] > registers[instruction[2]] ? 1 : 0); },
    gtri: (instruction: number[], registers: number[]) => { registers[instruction[3]] = (registers[instruction[1]] > instruction[2] ? 1 : 0); },
    gtrr: (instruction: number[], registers: number[]) => { registers[instruction[3]] = ((registers[instruction[1]] > registers[instruction[2]]) ? 1 : 0); },
    eqir: (instruction: number[], registers: number[]) => { registers[instruction[3]] = (instruction[1] === registers[instruction[2]] ? 1 : 0); },
    eqri: (instruction: number[], registers: number[]) => { registers[instruction[3]] = (registers[instruction[1]] === instruction[2] ? 1 : 0); },
    eqrr: (instruction: number[], registers: number[]) => { registers[instruction[3]] = ((registers[instruction[1]] === registers[instruction[2]]) ? 1 : 0); },
  };

  public async part1(): Promise<string | number> {
    for (let i = 0; i < this.lines.length; i += 1) {
      const line = this.lines[i];
      if (line.startsWith('Before:')) {
        const before = line.replace(/[^0-9 ]*/gi, '').trim().split(/\s/).map(Number);
        const instruction = this.lines[i + 1].split(/\s/).map(Number);
        const after = this.lines[i + 2].replace(/[^0-9 ]*/gi, '').trim().split(/\s/).map(Number);
        this.samples.push({ before, instruction, after });
        i += 3;
      } else if (line.trim()) {
        this.program.push(line.split(/\s/).map(Number));
      }
    }

    for (const sample of this.samples) {
      sample.validOpcodes = Object.keys(this.operations).filter((op: string) => this.operations[op](sample));
    }

    return this.samples.filter((sample: Sample) => sample.validOpcodes!.length >= 3).length;
  }

  public async part2(): Promise<string | number> {
    const output: { [key: string]: string[] } = {};
    for (const sample of this.samples) {
      const opcode = sample.instruction[0];
      if (!output[opcode]) {
        output[opcode] = Object.keys(this.operations);
      }
      output[opcode] = output[opcode].filter((op: string) => this.operations[op](sample));
    }
    let cleaned = true;
    while (cleaned) {
      cleaned = false;
      // find opcodes with only one possible operation
      const ops = Object.values(output).filter((o: string[]) => o.length === 1).map((o: string[]) => o[0]);
      if (ops) {
        for (const op of ops) {
          for (const key of Object.keys(output)) {
            if (output[key].length > 1 && output[key].includes(op)) {
              cleaned = true;
              output[key] = output[key].filter((o: string) => o !== op);
            }
          }
        }
      }
    }
    const opcodes: { [key: string]: string } = {};
    for (const key of Object.keys(output)) {
      [opcodes[key]] = output[key];
    }

    const registers = [0, 0, 0, 0];
    for (const instruction of this.program) {
      const opcode = opcodes[instruction[0]];
      if (opcode) {
        this.execute[opcode](instruction, registers);
      }
    }

    return registers[0];
  }
}
