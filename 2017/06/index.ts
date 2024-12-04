import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  private blocksHistory: string[] = [];

  private blocks: number[] = [];

  private addHistory(blocks: number[]): boolean {
    const key = blocks.join(",");
    if (this.isExample) {
      console.log(key);
    }
    if (!this.blocksHistory.includes(key)) {
      this.blocksHistory.push(key);
      return true;
    }
    return false;
  }

  private findMaxIndex(blocks: number[]): number {
    for (let i = 0; i < blocks.length; i += 1) {
      if (blocks[i] === Math.max(...blocks)) {
        return i;
      }
    }
    return -1;
  }

  public async part1(): Promise<string | number> {
    this.blocks = this.input.split(/\s/gi).filter(Boolean).map(Number);
    this.blocksHistory = [];
    let iterations = 0;

    while (this.addHistory(this.blocks)) {
      const index = this.findMaxIndex(this.blocks);
      const toAdd = this.blocks[index];
      this.blocks[index] = 0;

      let currentIndex = index + 1;
      for (let i = 0; i < toAdd; i += 1) {
        if (currentIndex >= this.blocks.length) {
          currentIndex = 0;
        }
        this.blocks[currentIndex] += 1;
        currentIndex += 1;
      }
      iterations += 1;
    }
    return iterations;
  }

  public async part2(): Promise<string | number> {
    return this.blocksHistory.length - this.blocksHistory.indexOf(this.blocks.join(","));
  }
}
