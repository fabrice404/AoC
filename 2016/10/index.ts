import AoCPuzzle from '../../puzzle';

interface Bot {
  id: number;
  low: number;
  high: number;
  chips: number[];
}

interface Output {
  id: number;
  chips: number[];
}

export default class Puzzle extends AoCPuzzle {
  private bots: Bot[] = [];

  private outputs: Output[] = [];

  private findOuput(id: number): Output {
    const found = this.outputs.find((o) => o.id === id);
    if (found) {
      return found;
    }
    this.outputs.push({ id, chips: [] });
    return this.outputs.find((o) => o.id === id)!;
  }

  private findBotOrOutput(id: number): Bot | Output {
    if (Object.is(Math.abs(id), id)) {
      return this.bots.find((b) => b.id === id)!;
    }
    return this.findOuput(id);
  }

  public async part1(): Promise<string | number> {
    const LOW = this.isExample ? 2 : 17;
    const HIGH = this.isExample ? 5 : 61;

    let result = 0;

    this.bots = this.lines
      .filter((line) => line.startsWith('bot'))
      .map((line) => {
        const [, id, lowType, lowValue, highType, highValue] = line.match(/bot (\d+) gives low to (bot|output) (\d+) and high to (bot|output) (\d+)/)!;
        return {
          id: +id,
          low: +lowValue * (lowType === 'output' ? -1 : 1),
          high: +highValue * (highType === 'output' ? -1 : 1),
          chips: [],
        };
      });

    for (const instruction of this.lines.filter((line) => line.startsWith('value'))) {
      const [, value, bot] = instruction.match(/value (\d+) goes to bot (\d+)/)!;
      this.bots.find((b) => b.id === +bot)!.chips.push(+value);
    }

    while (this.bots.some((b) => b.chips.length >= 2)) {
      const bot = this.bots.find((b) => b.chips.length >= 2);
      if (bot) {
        const [lowChip, highChip] = [bot.chips.shift()!, bot.chips.shift()!].sort((a, b) => (a > b ? 1 : -1));
        if (lowChip === LOW && highChip === HIGH) {
          result = bot.id;
        }

        this.findBotOrOutput(bot.low).chips.push(lowChip);
        this.findBotOrOutput(bot.high).chips.push(highChip);
      }
    }

    return result;
  }

  public async part2(): Promise<string | number> {
    return [-0, -1, -2].reduce((acc, id) => acc * this.findOuput(id).chips[0], 1);
  }
}
