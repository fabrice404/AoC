import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  private has4LettersPalindrome(str: string): boolean {
    let hasPalindrome = false;
    for (let i = 0; i < str.length - 3; i += 1) {
      const s = str.slice(i, i + 4);
      if (s[0] === s[3] && s[1] === s[2] && s[0] !== s[1]) {
        hasPalindrome = true;
      }
    }
    return hasPalindrome;
  }

  private get3LettersPalindrome(str: string): string[] {
    const palindromes: string[] = [];
    for (let i = 0; i < str.length - 2; i += 1) {
      const s = str.slice(i, i + 3);
      if (s[0] === s[2] && s[0] !== s[1]) {
        palindromes.push(s[1] + s[0] + s[1]);
      }
    }
    return palindromes;
  }

  public async part1(): Promise<string | number> {
    return this.lines.filter((line) => {
      const parts = line.split(/[[\]]/);
      const hypernetSequences = parts.filter((_, i) => i % 2 === 1);
      const sequences = parts.filter((_, i) => i % 2 === 0);

      return sequences.some((s) => this.has4LettersPalindrome(s)) && !hypernetSequences.some((s) => this.has4LettersPalindrome(s));
    }).length;
  }

  public async part2(): Promise<string | number> {
    return this.lines.filter((line) => {
      const parts = line.split(/[[\]]/);
      const hypernetSequences = parts.filter((_, i) => i % 2 === 1);
      const sequences = parts.filter((_, i) => i % 2 === 0);

      const sequencesPalindromes = sequences.map((s) => this.get3LettersPalindrome(s)).flat();
      return sequencesPalindromes.length > 0 && hypernetSequences.some((hs) => sequencesPalindromes.some((sp) => hs.includes(sp)));
    }).length;
  }
}
