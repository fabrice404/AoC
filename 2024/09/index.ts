import { sum } from "../../helpers/array";
import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  private disk: number[] = [];

  private findFreeSpace(l: number) {
    let start = -1;
    let length = 0;
    for (let i = 0; i < this.disk.length; i += 1) {
      if (length === l) {
        return start;
      }
      if (this.disk[i] === -1) {
        if (start === -1) {
          start = i;
        }
        length += 1;
      } else {
        start = -1;
        length = 0;
      }
    }
    return -1;
  }
  private initialiseDisk() {
    this.disk = [];
    let id = 0;
    this.input.split("").map((value, i) => {
      if (i % 2 === 0) {
        this.disk.push(...Array.from({ length: +value }, () => id));
        id += 1;
      } else {
        this.disk.push(...Array.from({ length: +value }, () => -1));
      }
    });
  }

  public async part1(): Promise<string | number> {
    this.initialiseDisk();
    for (let i = this.disk.length - 1; i >= 0; i -= 1) {
      const freeBlock = this.disk.indexOf(-1);
      if (freeBlock < i) {
        this.disk[freeBlock] = this.disk[i];
        this.disk[i] = -1;
      }
    }

    return sum(this.disk.map((val, i) => (val > 0 ? val * i : 0)));
  }

  public async part2(): Promise<string | number> {
    this.initialiseDisk();
    let lastId = Number.MAX_SAFE_INTEGER;

    for (let i = this.disk.length - 1; i >= 0; i -= 1) {
      const id = this.disk[i];
      if (id > 0 && id < lastId) {
        const start = this.disk.indexOf(id);
        const length = i - start + 1;
        const freeIndex = this.findFreeSpace(length);

        if (freeIndex !== -1 && freeIndex < start) {
          for (let j = 0; j < length; j += 1) {
            this.disk[freeIndex + j] = id;
            this.disk[i - j] = -1;
          }
          i -= length - 1;
        }
      }
      if (id > 0) {
        lastId = id;
      }
    }

    return sum(this.disk.map((val, i) => (val > 0 ? val * i : 0)));
  }
}
