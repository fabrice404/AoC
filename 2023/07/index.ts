import { countLetters } from '../../helpers/string';
import AoCPuzzle from '../../puzzle';

const CARDS = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];
const CARDS_JOKER = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J'];

interface Hand {
  cards: string[];
  bid: number;
  typeStrength: number;
  rank?: number;
}

enum TypeStrengths {
  fiveOfAKind = 7,
  fourOfAKind = 6,
  fullHouse = 5,
  threeOfAKind = 4,
  twoPairs = 3,
  onePair = 2,
  highCard = 1,
}

const findTypeStrength = (cards: string): number => {
  const count = countLetters(cards);
  const moreFrequent = Array.from(count.values()).sort((a, b) => b - a)[0];

  switch (count.size) {
    case 1: return TypeStrengths.fiveOfAKind;
    case 2: return moreFrequent === 4 ? TypeStrengths.fourOfAKind : TypeStrengths.fullHouse;
    case 3: return moreFrequent === 3 ? TypeStrengths.threeOfAKind : TypeStrengths.twoPairs;
    case 4: return TypeStrengths.onePair;
    default: return TypeStrengths.highCard;
  }
};

const findTypeStrengthWithJoker = (originalCards: string[]): number => {
  if (!originalCards.includes('J')) {
    return findTypeStrength(originalCards.join(''));
  }
  const cards = [...originalCards];
  const count = countLetters(cards.join('').replace(/J/g, ''));
  const moreFrequent = Array.from(count.entries()).sort((a, b) => {
    if (a[1] !== b[1]) {
      return b[1] > a[1] ? 1 : -1;
    }
    return CARDS.indexOf(b[0]) > CARDS.indexOf(a[0]) ? 1 : -1;
  });
  if (moreFrequent.length > 0) {
    return findTypeStrength(cards.join('').replace(/J/g, moreFrequent[0][0]));
  }
  return findTypeStrength(cards.join(''));
};

const sortHands = (a: Hand, b: Hand, reference: string[]) => {
  if (a.typeStrength !== b.typeStrength) {
    return a.typeStrength - b.typeStrength;
  }
  for (let i = 0; i < 5; i += 1) {
    const cardA = a.cards[i];
    const cardB = b.cards[i];
    if (reference.indexOf(cardA) !== reference.indexOf(cardB)) {
      return reference.indexOf(cardB) > reference.indexOf(cardA) ? 1 : -1;
    }
  }
  return 1;
};

export default class Puzzle extends AoCPuzzle {
  private hands: Hand[] = [];

  public async part1(): Promise<string | number> {
    this.hands = this.lines.map((line) => {
      const [cards, bid] = line.split(' ');
      const typeStrength = findTypeStrength(cards);

      const hand: Hand = {
        cards: cards.split(''),
        bid: parseInt(bid, 10),
        typeStrength,
      };
      return hand;
    });

    this.hands.sort((a, b) => sortHands(a, b, CARDS));
    this.hands.forEach((hand, index) => {
      hand.rank = index + 1;
    });

    return this.hands.reduce((acc, hand) => acc + (hand.bid * hand.rank!), 0);
  }

  public async part2(): Promise<string | number> {
    this.hands.forEach((hand) => {
      hand.typeStrength = findTypeStrengthWithJoker(hand.cards);
    });

    this.hands.sort((a, b) => sortHands(a, b, CARDS_JOKER));
    this.hands.forEach((hand, index) => {
      hand.rank = index + 1;
    });

    return this.hands.reduce((acc, hand) => acc + (hand.bid * hand.rank!), 0);
  }
}
