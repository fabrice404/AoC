import AoCPuzzle from "../../puzzle";

export default class Puzzle extends AoCPuzzle {
  public async part1(): Promise<string | number> {
    const validSectors: number[] = [];
    for (const line of this.lines) {
      const [name, sector, checksum] = line.match(/([a-z-]+)-(\d+)\[([a-z]+)\]/)!.slice(1);
      const charCounts: { [char: string]: number } = {};
      for (const char of name.replace(/-/g, "")) {
        charCounts[char] = (charCounts[char] || 0) + 1;
      }

      const sortedChars = Object.keys(charCounts).sort((a, b) => {
        if (charCounts[a] === charCounts[b]) {
          return a < b ? -1 : 1;
        }
        return charCounts[b] - charCounts[a];
      });

      if (sortedChars.slice(0, 5).join("") === checksum) {
        validSectors.push(+sector);
      }
    }
    return validSectors.reduce((acc, val) => acc + val, 0);
  }

  public async part2(): Promise<string | number> {
    const validRooms = [];
    for (const line of this.lines) {
      const [name, sector, checksum] = line.match(/([a-z-]+)-(\d+)\[([a-z]+)\]/)!.slice(1);
      const charCounts: { [char: string]: number } = {};
      for (const char of name.replace(/-/g, "")) {
        charCounts[char] = (charCounts[char] || 0) + 1;
      }

      const sortedChars = Object.keys(charCounts).sort((a, b) => {
        if (charCounts[a] === charCounts[b]) {
          return a < b ? -1 : 1;
        }
        return charCounts[b] - charCounts[a];
      });

      if (sortedChars.slice(0, 5).join("") === checksum) {
        validRooms.push({ name, sector });
      }
    }
    const alphabet = "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz";

    return validRooms
      .map((room) => {
        const { name, sector } = room;
        const decryptedName = name
          .split("")
          .map((char) => {
            if (char === "-") {
              return " ";
            }
            return alphabet[alphabet.indexOf(char) + (+sector % 26)];
          })
          .join("");
        return { name: decryptedName, sector };
      })
      .filter((room) => room.name.includes("very") || room.name.includes("north"))
      .map((room) => `${room.name}, ${room.sector}`)
      .sort()
      .join("\n")
      .trim();
  }
}
