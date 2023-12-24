import AoCPuzzle from '../../puzzle';

interface Range {
  destinationRange: bigint;
  sourceRange: bigint;
  length: bigint;
}

export default class Puzzle extends AoCPuzzle {
  private seeds: bigint[] = [];

  private ranges: any = {
    'seed-to-soil': [],
    'soil-to-fertilizer': [],
    'fertilizer-to-water': [],
    'water-to-light': [],
    'light-to-temperature': [],
    'temperature-to-humidity': [],
    'humidity-to-location': [],
  };

  private nextKey = (key: string): string => {
    const keys = Object.keys(this.ranges);
    return keys[keys.indexOf(key) + 1];
  };

  private getNextPosition(key: string, position: bigint): bigint {
    let result: bigint;
    const range: Range = this.ranges[key]
      .find((r: Range) => position >= r.sourceRange && position < r.sourceRange + r.length);

    if (range) {
      position = range.destinationRange - range.sourceRange + position;
    }

    if (key === 'humidity-to-location') {
      result = position;
    } else {
      result = this.getNextPosition(this.nextKey(key), position);
    }
    return result;
  }

  private run() {
    const results = this.seeds
      .map((seed) => this.getNextPosition(Object.keys(this.ranges)[0], seed));
    return results.reduce((a, b) => (a > b ? b : a), BigInt(results[0]));
  }

  public async part1(): Promise<string | number> {
    let currentMap = '';

    this.lines.filter((x) => x).forEach((line) => {
      if (line.startsWith('seeds')) {
        this.seeds = line.replace('seeds: ', '')
          .trim()
          .split(' ')
          .filter((x) => x)
          .map((n) => BigInt(n));
      } else if (line.endsWith('map:')) {
        currentMap = line.replace('map:', '').trim();
      } else {
        const [destinationRange, sourceRange, length] = line.split(' ').map((n) => BigInt(n));
        this.ranges[currentMap].push({ destinationRange, sourceRange, length });
      }
    });

    return this.run().toString();
  }

  public async part2(): Promise<string | number> {
    let finalResult: bigint | undefined;
    const tmp = this.lines[0].replace('seeds: ', '')
      .trim()
      .split(' ')
      .filter((x) => x)
      .map((n) => BigInt(n));
    for (let i = 0; i < tmp.length; i += 2) {
      let j: bigint = 0n;
      while (j < tmp[i + 1]) {
        this.seeds = [tmp[i] + j];
        const result = this.run();
        if (result <= (finalResult || result)) {
          finalResult = result;
        }
        j += 1n;
      }
    }
    return finalResult!.toString();
  }
}
