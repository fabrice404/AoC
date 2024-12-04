import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  private run(a: number, b: number) {
    const list = this.input.split(",").map(Number);
    list[1] = a;
    list[2] = b;

    for (let i = 0; i < list.length; i += 1) {
      const opcode = list[i];
      if (opcode === 1) {
        list[list[i + 3]] = list[list[i + 1]] + list[list[i + 2]];
        i += 3;
      } else if (opcode === 2) {
        list[list[i + 3]] = list[list[i + 1]] * list[list[i + 2]];
        i += 3;
      } else if (opcode === 99) {
        break;
      }
    }

    return list[0];
  }

  public async part1(): Promise<string | number> {
    return this.run(12, 2);
  }

  public async part2(): Promise<string | number> {
    const result = 19690720;
    for (let i = 0; i < 99; i += 1) {
      for (let j = 0; j < 99; j += 1) {
        if (this.run(i, j) === result) {
          return i * 100 + j;
        }
      }
    }

    return "<NOT FOUND>";
  }
}
