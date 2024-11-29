/* eslint-disable prefer-const */

import AoCPuzzle from '../../puzzle';

export default class Puzzle extends AoCPuzzle {
  private to16Bit(value: number): number {
    return value & 0xffff;
  }

  public async part1(): Promise<string | number> {
    const values = new Map<string, number>();

    const lines = this.input.split('\n').filter(Boolean);

    while (lines.length > 0) {
      const line = lines.shift()!;

      let [input, output] = line.split(' -> ');
      for (const key of values.keys()) {
        input = ` ${input} `.replace(` ${key} `, ` ${values.get(key)!.toString()} `);
      }
      input = input.replace('AND', '&').replace('OR', '|').replace('LSHIFT', '<<').replace('RSHIFT', '>>')
        .replace('NOT', '~');

      try {
        const result = this.to16Bit(eval(input));
        values.set(output, result);
      } catch (e) {
        lines.push(line);
      }
    }

    const sortedKeys = Array.from(values.keys()).sort();
    const result = [];
    for (const key of sortedKeys) {
      result.push(`${key}: ${values.get(key)!}`);
    }

    return result.join('\n');
  }

  public async part2(): Promise<string | number> {
    const values = new Map<string, number>();
    values.set('b', 46065);

    const lines = this.input.split('\n').filter(Boolean);

    while (lines.length > 0) {
      const line = lines.shift()!;
      if (line.endsWith(' -> b')) {
        continue;
      }

      let [input, output] = line.split(' -> ');
      for (const key of values.keys()) {
        input = ` ${input} `.replace(` ${key} `, ` ${values.get(key)!.toString()} `);
      }
      input = input.replace('AND', '&').replace('OR', '|').replace('LSHIFT', '<<').replace('RSHIFT', '>>')
        .replace('NOT', '~');

      try {
        const result = this.to16Bit(eval(input));
        values.set(output, result);
      } catch (e) {
        lines.push(line);
      }
    }

    const sortedKeys = Array.from(values.keys()).sort();
    const result = [];
    for (const key of sortedKeys) {
      result.push(`${key}: ${values.get(key)!}`);
    }

    return result.join('\n');
  }
}
