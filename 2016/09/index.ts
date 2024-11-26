import AoCPuzzle from '../../puzzle';

export default class Puzzle extends AoCPuzzle {
  public async part1(): Promise<string | number> {
    const result = this.lines.map((line) => {
      let chars = line.split('');
      const output = [];
      while (chars.length > 0) {
        const char = chars.shift();
        if (char === '(') {
          const [marker] = chars.join('').split(')');
          chars = chars.slice(marker.length + 1);

          const [length, repeat] = marker.split('x').map(Number);
          const sub = chars.slice(0, length).join('');
          const rest = chars.slice(length).join('');

          output.push(sub.repeat(repeat));
          chars = rest.split('');
        } else {
          output.push(char);
        }
      }
      return output.join('');
    });
    if (this.isExample) {
      console.log(result);
    }
    return result.join('').length;
  }

  private expand(line: string): number {
    let size = 0;
    const weights = line.split('').map(() => 1);

    for (let i = 0; i < line.length; i += 1) {
      const char = line[i];
      if (char === '(') {
        const [marker] = line.slice(i).split(')');
        const [length, repeat] = marker.slice(1).split('x').map(Number);
        for (let j = 0; j < length; j += 1) {
          weights[marker.length + 1 + i + j] *= (repeat);
        }
        i += marker.length;
      } else {
        size += weights[i];
      }
    }
    return size;
  }

  public async part2(): Promise<string | number> {
    return this.lines.reduce((acc, line) => acc + this.expand(line), 0);
  }
}
