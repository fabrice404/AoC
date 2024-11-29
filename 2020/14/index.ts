import { binaryToDecimal, decimalToBinary } from '../../helpers/numbers';
import AoCPuzzle from '../../puzzle';


interface Memory {
  address: number;
  value: string;
}

export default class Puzzle extends AoCPuzzle {
  private memories: Memory[] = [];

  private getMemory(address: number): Memory {
    let mem = this.memories.find((m) => m.address === address);
    if (!mem) {
      this.memories.push({ address, value: decimalToBinary(0, 36) })
      mem = this.memories.find((m) => m.address === address);
    }
    return mem!;
  }

  public async part1(): Promise<string | number> {
    let currentMask = '';
    for (const line of this.lines) {
      if (line.startsWith("mask")) {
        [, currentMask] = line.split(' = ');
      } else if (line.startsWith("mem")) {
        const [address, value] = line.split('=').map(s => +s.replace(/[^0-9]/gi, ''));
        const mem = this.getMemory(address);
        const tmpValue = decimalToBinary(value, 36);
        let newValue = '';
        for (let i = 0; i < 36; i += 1) {
          newValue += currentMask[i] !== 'X' ? currentMask[i] : tmpValue[i];
        }
        mem!.value = newValue;
      }
    }

    return this.memories.reduce((acc, m) => acc + binaryToDecimal(m.value), 0);
  }

  public async part2(): Promise<string | number> {
    this.memories = [];

    let currentMask = '';
    for (const line of this.lines) {
      if (line.startsWith("mask")) {
        [, currentMask] = line.split(' = ');
      } else if (line.startsWith("mem")) {
        const [address, value] = line.split('=').map(s => +s.replace(/[^0-9]/gi, ''));
        const tmpValue = decimalToBinary(address, 36);
        let newValue = '';

        for (let i = 0; i < 36; i += 1) {
          switch (currentMask[i]) {
            case 'X': newValue += 'X'; break;
            case '0': newValue += tmpValue[i]; break;
            case '1': newValue += '1'; break;
          }
        }

        const xCount = newValue.split('').filter(b => b === 'X').length;

        for (let i = 0; i < 2 ** xCount; i += 1) {
          const val = decimalToBinary(i, xCount).split('');
          const tmp = newValue.split('').map((s: string) => s === "X" ? val.shift() : s).join('');
          this.getMemory(binaryToDecimal(tmp)).value = decimalToBinary(value);
        }
      }
    }

    return this.memories.reduce((acc, m) => acc + binaryToDecimal(m.value), 0);
  }
}
