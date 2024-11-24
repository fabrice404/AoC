import AoCPuzzle from '../../puzzle';

export default class Puzzle extends AoCPuzzle {
  public async part1(): Promise<string | number> {
    let x = 1;
    let y = 1;
    const result = [];

    for (const line of this.lines) {
      const instructions = line.split('');
      for (const instruction of instructions) {
        switch (instruction) {
          case 'U': y -= 1; break;
          case 'D': y += 1; break;
          case 'L': x -= 1; break;
          case 'R': x += 1; break;
        }

        if (x < 0) x = 0;
        if (x > 2) x = 2;
        if (y < 0) y = 0;
        if (y > 2) y = 2;
      }
      result.push(x + 1 + (y * 3));
    }

    return result.join('');
  }

  public async part2(): Promise<string | number> {
    const keypad =
      '  1  ' +
      ' 234 ' +
      '56789' +
      ' ABC ' +
      '  D  ';

    let position = keypad.indexOf('5');
    const result = [];

    for (const line of this.lines) {
      const instructions = line.split('');
      for (const instruction of instructions) {
        switch (instruction) {
          case 'U': if (keypad[position - 5]?.trim()) { position -= 5; } break;
          case 'D': if (keypad[position + 5]?.trim()) { position += 5; } break;
          case 'L': if (keypad[position - 1]?.trim()) { position -= 1; } break;
          case 'R': if (keypad[position + 1]?.trim()) { position += 1; } break;
        }
      }
      result.push(keypad[position]);
    }

    return result.join('');
  }
}
