import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  private maxValue: number = Number.MIN_SAFE_INTEGER;

  private registers: Map<string, number> = new Map<string, number>();

  public async part1(): Promise<string | number> {
    this.registers = new Map<string, number>();

    for (const line of this.lines) {
      const [register, op, value, , conditionRegister, conditionOp, conditionValue] = line.split(/\s/gi);

      const registerValue = this.registers.get(register) || 0;
      const conditionRegisterValue = this.registers.get(conditionRegister) || 0;

      let condition = false;
      switch (conditionOp) {
        case "==":
          condition = conditionRegisterValue === +conditionValue;
          break;
        case "!=":
          condition = conditionRegisterValue !== +conditionValue;
          break;
        case ">":
          condition = conditionRegisterValue > +conditionValue;
          break;
        case "<":
          condition = conditionRegisterValue < +conditionValue;
          break;
        case ">=":
          condition = conditionRegisterValue >= +conditionValue;
          break;
        case "<=":
          condition = conditionRegisterValue <= +conditionValue;
          break;
        default:
          throw new Error(`Unknown condition operator: ${conditionOp}`);
      }

      if (condition) {
        switch (op) {
          case "inc":
            this.registers.set(register, registerValue + +value);
            this.maxValue = Math.max(this.maxValue, registerValue + +value);
            break;
          case "dec":
            this.registers.set(register, registerValue - +value);
            break;
          default:
            throw new Error(`Unknown operation: ${op}`);
        }
      }
    }

    return [...this.registers.values()].reduce((acc, val) => Math.max(acc, val), Number.MIN_SAFE_INTEGER);
  }

  public async part2(): Promise<string | number> {
    return this.maxValue;
  }
}
