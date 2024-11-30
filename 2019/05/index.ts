import AoCPuzzle from '../../puzzle';

export default class Puzzle extends AoCPuzzle {
  public compute(code: number[], input: number): number | undefined {
    let result;
    for (let i = 0; i < code.length; i += 1) {
      const [, b, c, ...opcodes] = code[i].toString().padStart(5, '0').split('').map(Number);
      const opcode = +opcodes.join('');

      const index1 = c === 0 ? code[i + 1] : i + 1;
      const index2 = b === 0 ? code[i + 2] : i + 2;
      const index3 = code[i + 3];

      const param1 = code[index1];
      const param2 = code[index2];
      switch (opcode) {
        case 1:
          code[index3] = param1 + param2;
          i += 3; break;
        case 2:
          code[index3] = param1 * param2;
          i += 3; break;
        case 3:
          code[index1] = input;
          i += 1; break;
        case 4:
          result = param1;
          i += 1; break;
        case 5:
          if (param1 !== 0) {
            i = param2 - 1;
          } else {
            i += 2;
          }
          break;
        case 6:
          if (param1 === 0) {
            i = param2 - 1;
          } else {
            i += 2;
          }
          break;
        case 7:
          code[index3] = (param1 < param2 ? 1 : 0)
          i += 3; break;
        case 8:
          code[index3] = (param1 === param2 ? 1 : 0)
          i += 3; break;
        case 99:
          return result;
        default:
          throw new Error(`Unknwon opcode ${JSON.stringify({ opcode, index1, index2, index3, param1, param2, input })}`);
      }
    }
    return result;
  }

  public async part1(): Promise<string | number> {
    const result = this.compute(this.input.split(',').map(Number), 1);
    return result ?? 'ERROR';
  }

  public async part2(): Promise<string | number> {
    const result = this.compute(this.input.split(',').map(Number), 5);
    return result ?? 'ERROR';
  }
}
