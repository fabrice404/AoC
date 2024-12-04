import AoCPuzzle from "../../puzzle";

interface Reeindeer {
  name: string;
  speed: number;
  duration: number;
  rest: number;
  score: number;
}

export default class Puzzle extends AoCPuzzle {
  private seconds = 0;

  private reeindeers: Reeindeer[] = [];

  private getDistance(reeindeer: Reeindeer, time: number): number {
    const cycle = reeindeer.duration + reeindeer.rest;
    const cycles = Math.floor(time / cycle);
    const remainder = time % cycle;
    return (cycles * reeindeer.duration + Math.min(remainder, reeindeer.duration)) * reeindeer.speed;
  }

  public async part1(): Promise<string | number> {
    this.seconds = this.isExample ? 1000 : 2503;
    let maxDistance = 0;
    for (const line of this.lines) {
      const [name, , , speed, , , duration, , , , , , , rest] = line.split(/\s/gi);
      this.reeindeers.push({
        name,
        speed: +speed,
        duration: +duration,
        rest: +rest,
        score: 0,
      });
      maxDistance = Math.max(maxDistance, this.getDistance(this.reeindeers[this.reeindeers.length - 1], this.seconds));
    }

    return maxDistance;
  }

  public async part2(): Promise<string | number> {
    for (let i = 1; i <= this.seconds; i += 1) {
      const distances = [];

      for (const reeindeer of this.reeindeers) {
        const distance = this.getDistance(reeindeer, i);
        distances.push({ reeindeer, distance });
      }

      const max = Math.max(...distances.map((d) => d.distance));

      distances
        .filter((d) => d.distance === max)
        .forEach((d) => {
          d.reeindeer.score += 1;
        });
    }

    console.log(this.reeindeers);

    return Math.max(...this.reeindeers.map((r) => r.score));
  }
}
