import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  public async part1(): Promise<string | number> {
    let value = this.input;
    for (let i = 0; i < 40; i += 1) {
      let newValue = "";
      let count = 1;
      for (let j = 0; j < value.length; j += 1) {
        if (value[j] === value[j + 1]) {
          count += 1;
        } else {
          newValue += `${count}${value[j]}`;
          count = 1;
        }
      }
      value = newValue;
    }
    return value.length;
  }

  public async part2(): Promise<string | number> {
    let value = this.input;
    for (let i = 0; i < 50; i += 1) {
      let newValue = "";
      let count = 1;
      for (let j = 0; j < value.length; j += 1) {
        if (value[j] === value[j + 1]) {
          count += 1;
        } else {
          newValue += `${count}${value[j]}`;
          count = 1;
        }
      }
      value = newValue;
    }
    return value.length;
  }
}
