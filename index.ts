import { existsSync } from 'fs';
import { performance } from 'perf_hooks';
import { readFile, generateCodeFile, updateStatFile, generateStatFile } from './helpers/file';

const today = new Date();
let year = today.getFullYear().toString();
let day = today.getDate().toString();

if (today.getMonth() < 11) {
  day = '1';
}

if (process.argv.length > 2) {
  [year, day] = process.argv[2].split(/\//gi);
}

year = year.padStart(4, '0');
day = day.padStart(2, '0');

const folder = `${__dirname}/${year}/${day}`;
const codeFile = `${folder}/index.ts`;
const statFile = `${__dirname}/${year}/stats.json`;

const inputFile = `${folder}/input.txt`;
const p1ExampleFile = `${folder}/example-part1.txt`;
const p2ExampleFile = `${folder}/example-part2.txt`;
const p1ExpectedFile = `${folder}/expected-part1.txt`;
const p2ExpectedFile = `${folder}/expected-part2.txt`;

if (!existsSync(codeFile)) {
  generateCodeFile(folder);
}

if (!existsSync(statFile)) {
  generateStatFile(statFile);
}

import(codeFile)
  .then(async ({ default: Puzzle }) => {
    const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date(Number(year), 11, Number(day)).getDay()];
    const date = `${dayName} ${year}-12-${day}`;
    console.log(`\n${date}\n`);

    console.log('+--------------------------+');
    console.log('|          PART 1          |');
    console.log('+--------------------------+');

    // part 1 - example
    const input = readFile(inputFile);
    let example = readFile(p1ExampleFile);
    let expected = readFile(p1ExpectedFile);
    const examplePuzzle = new Puzzle(example, true);

    const part1ExampleStart = performance.now();
    const part1ExampleResult = await examplePuzzle.part1();
    const part1ExampleEnd = performance.now();
    const part1ExampleTime = part1ExampleEnd - part1ExampleStart;

    if (expected === 'skip') {
      console.log(`Test case skipped (${(part1ExampleTime).toFixed(3)} ms)`);
    } else {
      if (`${part1ExampleResult}` !== `${expected}`) {
        throw new Error(`Test case failed: ${part1ExampleResult} != ${expected} (${(part1ExampleTime).toFixed(3)} ms)`);
      }
      console.log(`Test case success: ${part1ExampleResult} (${(part1ExampleTime).toFixed(3)} ms)`);
    }

    // part 1 - puzzle
    const part1Start = performance.now();
    const puzzle = new Puzzle(input);
    const part1Result = await puzzle.part1();
    const part1End = performance.now();
    const part1Time = part1End - part1Start;

    console.log(`Result: ${part1Result} (${(part1Time).toFixed(3)} ms)\n`);

    console.log('+--------------------------+');
    console.log('|          PART 2          |');
    console.log('+--------------------------+');

    // part 2 - example
    example = readFile(p2ExampleFile);
    expected = readFile(p2ExpectedFile);

    const part2ExampleStart = performance.now();
    if (example) {
      examplePuzzle.setInput(example);
    }
    const part2ExampleResult = await examplePuzzle.part2();
    const part2ExampleEnd = performance.now();
    const part2ExampleTime = part2ExampleEnd - part2ExampleStart;

    if (expected === 'skip') {
      console.log(`Test case skipped (${(part2ExampleTime).toFixed(3)} ms)`);
    } else {
      if (`${part2ExampleResult}` !== `${expected}`) {
        throw new Error(`Test case failed: ${part2ExampleResult} != ${expected} (${(part2ExampleTime).toFixed(3)} ms)`);
      }
      console.log(`Test case success: ${part2ExampleResult} (${(part2ExampleTime).toFixed(3)} ms)`);
    }

    // part 2 - puzzle
    const part2Start = performance.now();
    const part2Result = await puzzle.part2();
    const part2End = performance.now();
    const part2Time = part2End - part2Start;

    console.log(`Result: ${part2Result} (${(part2Time).toFixed(3)} ms)\n`);

    updateStatFile(statFile, +day, {
      part1ExampleResult,
      part1ExampleTime,
      part1Result,
      part1Time,
      part2ExampleResult,
      part2ExampleTime,
      part2Result,
      part2Time,
    });
  });
