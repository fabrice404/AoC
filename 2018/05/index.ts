import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  private regex: RegExp =
    /aA|bB|cC|dD|eE|fF|gG|hH|iI|jJ|kK|lL|mM|nN|oO|pP|qQ|rR|sS|tT|uU|vV|wW|xX|yY|zZ|Aa|Bb|Cc|Dd|Ee|Ff|Gg|Hh|Ii|Jj|Kk|Ll|Mm|Nn|Oo|Pp|Qq|Rr|Ss|Tt|Uu|Vv|Ww|Xx|Yy|Zz/g;

  public async part1(): Promise<string | number> {
    let input = `${this.input}`;
    while (input.match(this.regex)) {
      input = input.replace(this.regex, "");
    }
    return input.length;
  }

  public async part2(): Promise<string | number> {
    const results = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"].map((letter) => {
      let input = `${this.input}`.replace(new RegExp(letter, "gi"), "");
      while (input.match(this.regex)) {
        input = input.replace(this.regex, "");
      }
      return input.length;
    });
    return Math.min(...results);
  }
}
