import AoCPuzzle from '../../puzzle';

export default class Puzzle extends AoCPuzzle {
  private layers: number[] = [];

  private debug(msg: any): void {
    if (this.isExample) {
      console.log(msg);
    }
  }

  private scannerPosition(t: number, range: number): number {
    return range - 1 - Math.abs((t % (range * 2 - 2)) - (range - 1));
  }

  private run(delay: number, earlyExit: boolean = false): number[] {
    this.debug(`\n\nDELAY ${delay}`);

    const caughts: number[] = [];
    for (let t = 0; t < this.layers.length; t += 1) {
      this.debug(`======================================================== ${t} `);
      this.debug(
        this.layers.map((l, i) => ` ${i} `).join('   '),
      );
      this.debug(
        this.layers.map((l, i) => (i === (t) ? `\x1b[43m ${(t + delay) % (l * 2 - 2)} \x1b[0m` : ` ${(t + delay) % (l * 2 - 2)} `)).join('   '),
      );

      const range = this.layers[t];
      if (range === 0) {
        continue;
      }

      const scannerPosition = this.scannerPosition(t + delay, range);
      if (scannerPosition === 0) {
        caughts.push(t * range);
        if (earlyExit) {
          return caughts;
        }
      }
    }

    return caughts;
  }

  public async part1(): Promise<string | number> {
    this.layers = Array.from({ length: +this.lines[this.lines.length - 1].split(': ')[0] }, () => 0);
    for (const line of this.lines) {
      const [layer, range] = line.split(': ').map(Number);
      this.layers[layer] = range;
    }

    return this.run(0).reduce((acc, val) => acc + val, 0);
  }

  public async part2(): Promise<string | number> {
    let delay = 0;
    while (true) {
      if (this.run(delay, true).length === 0) {
        return delay;
      }

      delay += 1;
    }
  }
}
