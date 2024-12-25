import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  private compatible(lock: number[], key: number[]) {
    return (
      lock[5] === key[5] && lock[0] + key[0] <= lock[5] && lock[1] + key[1] <= lock[5] && lock[2] + key[2] <= lock[5] && lock[3] + key[3] <= lock[5] && lock[4] + key[4] <= lock[5]
    );
  }

  public async part1(): Promise<string | number> {
    const locks: number[][] = [];
    const keys: number[][] = [];

    const input = this.input.split("\n\n");

    for (const inp of input) {
      const schematic = inp.trim().split("\n");
      const result: number[] = [0, 0, 0, 0, 0, schematic.length];
      for (let i = 0; i < schematic.length; i++) {
        if (schematic[i][0] === "#") {
          result[0] += 1;
        }
        if (schematic[i][1] === "#") {
          result[1] += 1;
        }
        if (schematic[i][2] === "#") {
          result[2] += 1;
        }
        if (schematic[i][3] === "#") {
          result[3] += 1;
        }
        if (schematic[i][4] === "#") {
          result[4] += 1;
        }
      }
      if (schematic[0] === "#####") {
        locks.push(result);
      } else {
        keys.push(result);
      }
    }

    let total = 0;
    for (const lock of locks) {
      for (const key of keys) {
        if (this.compatible(lock, key)) {
          total += 1;
        }
      }
    }

    return total;
  }

  public async part2(): Promise<string | number> {
    return "Happy Xmas!";
  }
}
