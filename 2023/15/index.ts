import { sum } from '../../helpers/array';
import AoCPuzzle from '../../puzzle';

interface Lens {
  label: string;
  focalLength: number;
}

const hash = (sequence: string): number => {
  let value = 0;
  sequence.split('').forEach((char, i) => {
    value += sequence.charCodeAt(i);
    value *= 17;
    value %= 256;
  });
  return value;
};

export default class Puzzle extends AoCPuzzle {
  public part1(): string | number {
    return sum(this.input.split(/,/gi).map(hash));
  }

  public part2(): string | number {
    const boxes = Array(255);

    this.input.split(/,/gi).forEach((sequence) => {
      const [label, focal] = sequence.split(/=|-/gi);
      const boxId = hash(label);
      if (!boxes[boxId]) {
        boxes[boxId] = [];
      }
      const lensIndex = boxes[boxId].findIndex((l: Lens) => l.label === label);

      if (sequence.match(/=/gi)) {
        const lens: Lens = { label, focalLength: parseInt(focal, 10) };
        if (lensIndex !== -1) {
          boxes[boxId][lensIndex] = lens;
        } else {
          boxes[boxId].push(lens);
        }
      } else if (lensIndex !== -1) {
        boxes[boxId].splice(lensIndex, 1);
      }
    });

    return sum(boxes.map((box, i) => sum(
      box.map((lens: Lens, j: number) => (i + 1) * (j + 1) * lens.focalLength),
    )));
  }
}
