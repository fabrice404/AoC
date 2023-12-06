import AoCPuzzle from '../../puzzle';

interface Symbol {
  symbol: string;
  row: number;
  col: number;
}

interface Part {
  value: number;
  symbols: Symbol[];
}

export default class Puzzle extends AoCPuzzle {
  private parts: Part[] = [];

  public part1(): string | number {
    this.lines.forEach((line, row) => {
      let currentNum = '';
      let posStart = -1;
      let posEnd = -1;
      for (let i = 0; i < line.length; i += 1) {
        const char = line[i];
        if (line[i].match(/[0-9]/)) {
          if (posStart === -1) {
            posStart = i;
          }

          currentNum += char;
        } else if (posStart !== -1) {
          if (!line[i].match(/[0-9]/)) {
            posEnd = i - 1;
          }
        }
        if (i === line.length - 1 && posEnd === -1) {
          posEnd = i;
        }

        if (posStart !== -1 && posEnd !== -1) {
          const symbols: Symbol[] = [];

          const posLeft = Math.max(posStart - 1, 0);
          const posRight = Math.min(posEnd + 1, line.length - 1);

          if (row > 0) {
            for (let j = posLeft; j <= posRight; j += 1) {
              if (this.lines[row - 1][j] !== '.') {
                symbols.push({ symbol: this.lines[row - 1][j], row: row - 1, col: j });
              }
            }
          }

          if (row < this.lines.length - 1) {
            for (let j = posLeft; j <= posRight; j += 1) {
              if (this.lines[row + 1][j] !== '.') {
                symbols.push({ symbol: this.lines[row + 1][j], row: row + 1, col: j });
              }
            }
          }

          if (posStart > 0 && this.lines[row][posStart - 1] !== '.') {
            symbols.push({ symbol: this.lines[row][posStart - 1], row, col: posStart - 1 });
          }

          if (posEnd < line.length - 1 && this.lines[row][posEnd + 1] !== '.') {
            symbols.push({ symbol: this.lines[row][posEnd + 1], row, col: posEnd + 1 });
          }

          if (symbols.length > 0) {
            this.parts.push({ value: parseInt(currentNum, 10), symbols });
          }

          currentNum = '';
          posStart = -1;
          posEnd = -1;
        }
      }
    });

    return this.parts.reduce((acc, cur) => acc + cur.value, 0);
  }

  public part2(): string | number {
    const potentialGearParts = this.parts
      .filter((part) => part.symbols.some((symbol) => symbol.symbol === '*'));

    const gears: number[] = [];

    while (potentialGearParts.length > 0) {
      const part1 = potentialGearParts.pop();
      const gear = part1!.symbols.find((symbol) => symbol.symbol === '*');

      const indexFound = potentialGearParts
        .findIndex((potentialGearPart) => potentialGearPart.symbols
          .find((symbol) => symbol.col === gear?.col && symbol.row === gear?.row));
      if (indexFound !== -1) {
        const part2 = potentialGearParts.splice(indexFound, 1)[0];
        gears.push(part1!.value * part2!.value);
      }
    }

    return gears.reduce((acc, cur) => acc + cur, 0);
  }
}
