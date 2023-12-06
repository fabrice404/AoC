import { existsSync } from 'fs';
import { performance, PerformanceObserver } from 'perf_hooks';
import { readFile, generateCodeFile } from './helpers/file';

const today = new Date();
let year = today.getFullYear().toString();
let day = today.getDate().toString().padStart(2, '0');

if (process.argv.length > 2) {
  [year, day] = process.argv[2].split(/\//gi);
}

const folder = `${__dirname}/${year}/${day}`;
const codeFile = `${folder}/index.ts`;

const inputFile = `${folder}/input.txt`;
const p1ExampleFile = `${folder}/example-part1.txt`;
const p2ExampleFile = `${folder}/example-part2.txt`;
const p1ExpectedFile = `${folder}/expected-part1.txt`;
const p2ExpectedFile = `${folder}/expected-part2.txt`;

if (!existsSync(codeFile)) {
  generateCodeFile(folder);
}

import(codeFile)
  .then(({ default: Puzzle }) => {
    const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date(Number(year), 11, Number(day)).getDay()];
    console.log(`\n${dayName} ${day} December ${year}\n`);

    // const performanceObserver = new PerformanceObserver();

    // part 1 - example
    console.log('+--------------------------+');
    console.log('|          PART 1          |');
    console.log('+--------------------------+');
    let example = readFile(p1ExampleFile);
    let expected = readFile(p1ExpectedFile);

    const part1ExampleStart = performance.now();
    const examplePuzzle = new Puzzle(example);
    let result = examplePuzzle.part1();
    const part1ExampleEnd = performance.now();

    if (`${result}` !== `${expected}`) {
      throw new Error(`Test case failed: ${result} != ${expected} (${(part1ExampleEnd - part1ExampleStart).toFixed(3)} ms)`);
    }
    console.log(`Test case success: ${result} (${(part1ExampleEnd - part1ExampleStart).toFixed(3)} ms)`);

    // // part 1 - puzzle
    const input = readFile(inputFile);

    const part1Start = performance.now();
    const puzzle = new Puzzle(input);
    result = puzzle.part1();
    const part1End = performance.now();

    console.log(`Result: ${result} (${(part1End - part1Start).toFixed(3)} ms)\n`);

    // part 2 - example
    console.log('+--------------------------+');
    console.log('|          PART 2          |');
    console.log('+--------------------------+');
    example = readFile(p2ExampleFile);
    expected = readFile(p2ExpectedFile);
    const part2ExampleStart = performance.now();
    if (example) {
      examplePuzzle.setInput(example);
    }
    result = examplePuzzle.part2();
    const part2ExampleEnd = performance.now();

    if (`${result}` !== `${expected}`) {
      throw new Error(`Test case failed: ${result} != ${expected} (${(part2ExampleEnd - part2ExampleStart).toFixed(3)} ms)`);
    }
    console.log(`Test case success: ${result} (${(part2ExampleEnd - part2ExampleStart).toFixed(3)} ms)`);

    // part 2 - puzzle
    const part2Start = performance.now();
    result = puzzle.part2();
    const part2End = performance.now();

    console.log(`Result: ${result} (${(part2End - part2Start).toFixed(3)} ms)\n`);
  });
