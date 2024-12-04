import AoCPuzzle from "../../puzzle";

interface Card {
  winning: number[];
  numbers: number[];
  matching: number;
  cards?: Card[];
}
export default class Puzzle extends AoCPuzzle {
  private cards: Card[] = [];

  public async part1(): Promise<string | number> {
    this.cards = this.lines.map((line) => {
      let [winning, numbers] = line
        .split(/:/)[1]
        .split(/\|/)
        .map((n) =>
          n
            .trim()
            .split(" ")
            .filter((x) => x)
            .map((num) => parseInt(num, 10)),
        );
      winning = [...new Set(winning)];
      numbers = [...new Set(numbers)];
      const power = numbers.reduce((acc, val) => {
        if (winning.includes(val)) {
          acc += 1;
        }
        return acc;
      }, 0);
      const card: Card = {
        winning,
        numbers,
        matching: power,
      };
      return card;
    });
    return this.cards.reduce((acc, val) => {
      if (val.matching > 0) {
        acc += 2 ** (val.matching - 1);
      }
      return acc;
    }, 0);
  }

  public async part2(): Promise<string | number> {
    this.cards.forEach((card, i) => {
      if (card.matching > 0) {
        card.cards = [];
        for (let j = 0; j < card.matching; j += 1) {
          card.cards.push(this.cards[i + j + 1]);
        }
      }
    });
    // console.dir(this.cards, { depth: null });

    const countCards = (cards: Card[]): number =>
      cards
        .map((card) => {
          if (card.cards) {
            return 1 + countCards(card.cards);
          }
          return 1;
        })
        .reduce((acc, val) => acc + val, 0);

    return countCards(this.cards);
  }
}
