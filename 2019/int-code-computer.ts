export class IntCodeComputer {
  private code: number[];

  private inputs: number[];

  private lastIndex: number;

  private relativeBase: number;

  public output: number;

  constructor(code: string, inputs: number[] = []) {
    this.code = code.split(",").map(Number);
    this.lastIndex = 0;
    this.output = 0;
    this.inputs = inputs;
    this.relativeBase = 0;
  }

  public addInputs(inputs: number[]) {
    this.inputs.push(...inputs);
  }

  public compute(restart: boolean = true): boolean {
    for (let i = restart ? 0 : this.lastIndex; i < this.code.length; i += 1) {
      this.lastIndex = i;
      const code = this.code[i];
      const [a, b, c, ...opcodes] = code.toString().padStart(5, "0").split("").map(Number);
      const opcode = +opcodes.join("");

      const index1 = c === 0 ? this.code[i + 1] : c === 1 ? i + 1 : this.code[i + 1] + this.relativeBase;
      const index2 = b === 0 ? this.code[i + 2] : b === 1 ? i + 2 : this.code[i + 2] + this.relativeBase;
      const index3 = a === 0 ? this.code[i + 3] : a === 1 ? i + 3 : this.code[i + 3] + this.relativeBase;

      const param1 = this.code[index1];
      const param2 = this.code[index2];

      // console.log(JSON.stringify({ i, code, opcode, index1, index2, index3, param1, param2, inputs: this.inputs }));

      switch (opcode) {
        case 1:
          this.code[index3] = param1 + param2;
          i += 3;
          break;
        case 2:
          this.code[index3] = param1 * param2;
          i += 3;
          break;
        case 3:
          if (this.inputs.length === 0) {
            throw new Error(`Unexpected opcode 3 with empty inputs!`);
          }
          this.code[index1] = this.inputs.shift()!;
          i += 1;
          break;
        case 4:
          this.output = param1;
          i += 1;
          this.lastIndex = i + 1;
          return false;
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
          this.code[index3] = param1 < param2 ? 1 : 0;
          i += 3;
          break;
        case 8:
          this.code[index3] = param1 === param2 ? 1 : 0;
          i += 3;
          break;
        case 9:
          this.relativeBase += param1;
          i += 1;
          break;
        case 99:
          return true;
        default:
          throw new Error(`Unknwon opcode ${JSON.stringify({ opcode, index1, index2, index3, param1, param2, inputs: this.inputs })}`);
      }
    }
    return false;
  }
}
