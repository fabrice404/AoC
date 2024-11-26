import AoCPuzzle from '../../puzzle';

export default class Puzzle extends AoCPuzzle {
  private alphabet: string = 'abcdefghjkmnpqrstuvwxyz';

  private password: string = '';

  private isValidPassword(password: string): boolean {
    // check for invalid characters
    if (password.match(/[iol]/)) {
      return false;
    }

    // find group of 3 consecutive letters
    let foundGroup = false;
    for (let i = 0; i < password.length - 2; i += 1) {
      if (this.alphabet.includes(password.slice(i, i + 3))) {
        foundGroup = true;
      }
    }
    if (!foundGroup) {
      return false;
    }

    // find 2 pairs of letters
    let foundPairs = 0;
    let i = 0;
    while (i < password.length - 1) {
      if (password[i] === password[i + 1]) {
        foundPairs += 1;
        i += 1;
      }
      i += 1;
    }
    return foundPairs >= 2;
  }

  private incrementPassword(password: string): string {
    let i = password.length - 1;
    const newPass = password.split('');
    while (i >= 0) {
      const index = this.alphabet.indexOf(password[i]);
      if (index === this.alphabet.length - 1) {
        [newPass[i]] = this.alphabet;
        i -= 1;
      } else {
        newPass[i] = this.alphabet[index + 1];
        break;
      }
    }
    return newPass.join('');
  }

  public async part1(): Promise<string | number> {
    this.password = this.input;
    do {
      this.password = this.incrementPassword(this.password);
    } while (!this.isValidPassword(this.password));

    return this.password;
  }

  public async part2(): Promise<string | number> {
    do {
      this.password = this.incrementPassword(this.password);
    } while (!this.isValidPassword(this.password));

    return this.password;
  }
}
