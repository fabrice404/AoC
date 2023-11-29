import { existsSync } from "fs";
import { readFile, generateCodeFile } from "./helpers/file";

let today = new Date();
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
  .then(({ Puzzle }) => {

    const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date(Number(year), 11, Number(day)).getDay()];
    console.log(`\n${dayName} ${day} December ${year}\n`);

    // part 1 - example
    console.log("+--------------------------+");
    console.log("|          PART 1          |");
    console.log("+--------------------------+");
    let example = readFile(p1ExampleFile);
    let expected = readFile(p1ExpectedFile);
    const examplePuzzle = new Puzzle(example);
    let result = examplePuzzle.part1();
    if (result != expected) {
      throw new Error(`Test case failed: ${result} != ${expected}`);
    }
    console.log(`Test case success: ${result}`);

    // // part 1 - puzzle
    const input = readFile(inputFile);
    const puzzle = new Puzzle(input);
    result = puzzle.part1();
    console.log(`Result: ${result}\n`);

    // // part 2 - example
    console.log("+--------------------------+");
    console.log("|          PART 2          |");
    console.log("+--------------------------+");
    example = readFile(p2ExampleFile);
    expected = readFile(p2ExpectedFile);
    if (example) {
      examplePuzzle.setInput(example);
    }
    result = examplePuzzle.part2();
    if (result != expected) {
      throw new Error(`Test case failed: ${result} != ${expected}`);
    }
    console.log(`Test case success: ${result}`);

    // part 2 - puzzle
    result = puzzle.part2();
    console.log(`Result: ${result}\n`);
  });
