import { AoCPuzzle } from "../../puzzle";

export class Puzzle extends AoCPuzzle {
  private waysToWin(times: number[], distances: number[]) {
    return times.map((time, i) => {
      const recordDistance = distances[i];
      let waysToWin = 0;

      for (let hold = 0; hold < time; hold += 1) {
        let speed = 1 * hold;
        let remainingTime = time - hold;
        let distance = speed * remainingTime;
        if (distance > recordDistance) {
          waysToWin += 1;
        }
      }
      return waysToWin;
    })
      .reduce((a, b) => a * b, 1);
  }

  public part1(): string | number {
    const [times, distances] = this.lines.map(line => line.split(":")[1].trim().split(" ").filter(x => x).map(n => parseInt(n, 10)));
    return this.waysToWin(times, distances);
  }

  public part2(): string | number {
    const [times, distances] = this.lines.map(line => line.split(":")[1].trim().replace(/ /gi, "")).map(n => parseInt(n, 10));
    return this.waysToWin([times], [distances]);
  }
}
