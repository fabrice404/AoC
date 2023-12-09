import AoCPuzzle from '../../puzzle';

interface Marble {
  value: number;
  left: number;
  right: number;
}

export default class Puzzle extends AoCPuzzle {
  private nodes: { [key: number]: Marble } = {};

  private multiplier: number = 1;

  private insertMarble(marbleBefore: number, value: number): void {
    const rightMarble = this.nodes[marbleBefore].right;
    this.nodes[value] = {
      value,
      left: marbleBefore,
      right: rightMarble,
    };

    this.nodes[marbleBefore].right = value;
    this.nodes[rightMarble].left = value;
  }

  private removeMarble(value: number): void {
    this.nodes[this.nodes[value].left].right = this.nodes[value].right;
    this.nodes[this.nodes[value].right].left = this.nodes[value].left;

    delete this.nodes[value];
  }

  private getMarble7Before(marble: Marble): Marble {
    let currentMarble = marble;
    for (let i = 0; i < 7; i += 1) {
      currentMarble = this.nodes[currentMarble.left];
    }
    return currentMarble;
  }

  private play() {
    const [players, marbles] = this.lines[0]!.match(/\d+/g)!.map((value) => Number(value));

    const scores = Array(players).fill(0);

    let currentPlayer = 0;
    let currentMarble = 0;

    this.nodes[currentMarble] = { left: currentMarble, right: currentMarble, value: 0 };
    for (let i = 1; i <= marbles * this.multiplier; i += 1) {
      if (i % 23 === 0) {
        scores[currentPlayer] += i;
        const removMarble = this.getMarble7Before(this.nodes[currentMarble]);
        scores[currentPlayer] += removMarble.value;
        currentMarble = removMarble.right;
        this.removeMarble(removMarble.value);
      } else {
        const marbleBefore = this.nodes[currentMarble].right;
        this.insertMarble(marbleBefore, i);
        currentMarble = i;
      }
      currentPlayer = (currentPlayer + 1) % players;
    }
    return Math.max(...scores);
  }

  public part1(): string | number {
    return this.play();
  }

  public part2(): string | number {
    this.multiplier = 100;
    return this.play();
  }
}
