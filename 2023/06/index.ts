import AoCPuzzle from '../../puzzle';

export default class Puzzle extends AoCPuzzle {
  private times: number[] = [];

  private distances: number[] = [];

  private waysToWin() {
    return this.times.map((time, i) => {
      const recordDistance = this.distances[i];
      let waysToWin = 0;

      for (let hold = 0; hold < time; hold += 1) {
        const speed = 1 * hold;
        const remainingTime = time - hold;
        const distance = speed * remainingTime;
        if (distance > recordDistance) {
          waysToWin += 1;
        }
      }
      return waysToWin;
    })
      .reduce((a, b) => a * b, 1);
  }

  public part1(): string | number {
    const [times, distances] = this.lines.map((line) => line.split(':')[1].trim().split(' ').filter((x) => x).map((n) => parseInt(n, 10)));
    this.times = times;
    this.distances = distances;
    return this.waysToWin();
  }

  public part2(): string | number {
    const [times, distances] = this.lines.map((line) => line.split(':')[1].trim().replace(/ /gi, '')).map((n) => parseInt(n, 10));
    this.times = [times];
    this.distances = [distances];
    return this.waysToWin();
  }
}
