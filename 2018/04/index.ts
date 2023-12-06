import { replaceAt } from '../../helpers/string';
import AoCPuzzle from '../../puzzle';

export default class Puzzle extends AoCPuzzle {
  private guards: any = {};

  public part1(): string | number {
    this.lines = this.lines.sort();
    let lastGuard: string = '';
    for (let i = 0; i < this.lines.length; i += 1) {
      const day = this.lines[i].split(' ')[0].split('-')[2];
      if (this.lines[i].includes('Guard')) {
        lastGuard = this.lines[i].split(' ')[3].replace('#', '');
      } else if (this.lines[i].includes('falls asleep')) {
        const start = parseInt(this.lines[i].split(' ')[1].split(':')[1].split(']')[0], 10);
        const end = parseInt(this.lines[i + 1].split(' ')[1].split(':')[1].split(']')[0], 10);
        if (!this.guards[lastGuard]) {
          this.guards[lastGuard] = {
            duration: 0,
            days: {},
          };
        }
        this.guards[lastGuard].duration += (end - start);
        if (!this.guards[lastGuard].days[day]) {
          this.guards[lastGuard].days[day] = '............................................................';
        }
        for (let j = start; j < end; j += 1) {
          this.guards[lastGuard].days[day] = replaceAt(this.guards[lastGuard].days[day], j, '#');
        }
      }
    }

    let guardId: number = 0;
    let maxDuration = 0;
    Object.keys(this.guards)
      .forEach((key) => {
        const value = this.guards[key];
        if (value.duration > maxDuration) {
          maxDuration = value.duration;
          guardId = parseInt(key, 10);
        }
      });

    let minute = 0;
    let minuteCount = 0;
    const keys = Object.keys(this.guards[guardId].days);
    for (let i = 0; i < 60; i += 1) {
      let count = 0;
      for (let j = 0; j < keys.length; j += 1) {
        if (this.guards[guardId].days[keys[j]][i] === '#') {
          count += 1;
        }
      }
      if (count > minuteCount) {
        minuteCount = count;
        minute = i;
      }
    }
    return guardId * minute;
  }

  public part2(): string | number {
    let minute = 0;
    let guardId = 0;
    let minuteCount = 0;

    const guardKeys = Object.keys(this.guards);
    for (let i = 0; i < guardKeys.length; i += 1) {
      const guardKey = guardKeys[i];
      const keys = Object.keys(this.guards[guardKey].days);
      for (let j = 0; j < 60; j += 1) {
        let count = 0;
        for (let k = 0; k < keys.length; k += 1) {
          if (this.guards[guardKey].days[keys[k]][j] === '#') {
            count += 1;
          }
        }
        if (count > minuteCount) {
          minuteCount = count;
          minute = j;
          guardId = parseInt(guardKey, 10);
        }
      }
    }
    return guardId * minute;
  }
}
