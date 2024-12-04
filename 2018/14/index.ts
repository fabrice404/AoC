import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  public async part1(): Promise<string | number> {
    let indexA = 0;
    let indexB = 1;

    let scores = "37";
    while (scores.length < +this.input + 10) {
      const scoreA = +scores[indexA];
      const scoreB = +scores[indexB];
      scores += (scoreA + scoreB).toString();
      indexA = (indexA + scoreA + 1) % scores.length;
      indexB = (indexB + scoreB + 1) % scores.length;
    }

    return scores.substring(scores.length - 10);
  }

  private lastLookedPosition: number = 0;

  private ninput: number[] = [];

  private findSequence(scores: number[]): number {
    while (true) {
      if (scores.length < this.ninput.length) {
        return -1;
      }

      const loc = scores.indexOf(this.ninput[0], this.lastLookedPosition);
      if (loc < 0 || loc + this.ninput.length > scores.length) {
        return -1;
      }

      this.lastLookedPosition = loc + 1;
      if (this.ninput.slice(1).every((n, index) => n === scores[index + this.lastLookedPosition])) {
        return loc;
      }
    }
  }

  public async part2(): Promise<string | number> {
    this.ninput = this.input.split("").map(Number);

    let indexA = 0;
    let indexB = 1;

    const scores = [3, 7];
    let location = -1;

    while (location < 0) {
      const scoreA = +scores[indexA];
      const scoreB = +scores[indexB];
      scores.push(...(scoreA + scoreB).toString().split("").map(Number));
      indexA = (indexA + scoreA + 1) % scores.length;
      indexB = (indexB + scoreB + 1) % scores.length;
      location = this.findSequence(scores);
    }

    return location;
  }
}
