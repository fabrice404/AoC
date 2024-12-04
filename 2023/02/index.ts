import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  public async part1(): Promise<string | number> {
    const MAX: any = {
      red: 12,
      green: 13,
      blue: 14,
    };

    const result = this.lines
      .map((line) => {
        const [game, ...rounds] = line.split(/:|;/gi);

        let possible = true;
        rounds.forEach((round) => {
          const sets = round.split(",").map((set) => set.trim().split(" "));
          sets.forEach((set) => {
            const [number, color] = set;
            if (parseInt(number, 10) > MAX[color]) {
              possible = false;
            }
          });
        });
        if (possible) {
          return parseInt(game.replace(/[^0-9]/gi, ""), 10);
        }
        return null;
      })
      .filter((x) => x)
      .reduce((acc, val) => acc! + val!, 0);

    return result!;
  }

  public async part2(): Promise<string | number> {
    const result = this.lines
      .map((line) => {
        const [, ...rounds] = line.split(/:|;/gi);

        const max: any = {
          red: 0,
          green: 0,
          blue: 0,
        };

        rounds.forEach((round) => {
          const sets = round.split(",").map((set) => set.trim().split(" "));
          sets.forEach((set) => {
            const number = parseInt(set[0], 10);
            const color = set[1];
            if (number > max[color]) {
              max[color] = number;
            }
          });
        });
        return max.red * max.green * max.blue;
      })
      .reduce((acc, val) => acc! + val!, 0);
    return result;
  }
}
