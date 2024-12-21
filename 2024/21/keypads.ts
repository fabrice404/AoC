const U = "^";
const D = "v";
const L = "<";
const R = ">";

/*
,---,---,---,
| 7 | 8 | 9 |
,---,---,---,
| 4 | 5 | 6 |
,---,---,---,
| 1 | 2 | 3 |
,---,---,---,
    | 0 | A |
    ,---,---,
*/

export const NUMERIC_KEYPAD = {
  A: {
    A: [],
    0: [L],
    1: [U, L, L],
    2: [U, L],
    3: [U],
    4: [U, U, L, L],
    5: [U, U, L],
    6: [U, U],
    7: [U, U, U, L, L],
    8: [U, U, U, L],
    9: [U, U, U],
  },
  0: {
    A: [R],
    0: [],
    1: [U, L],
    2: [U],
    3: [U, R],
    4: [U, U, L],
    5: [U, U],
    6: [U, U, R],
    7: [U, U, U, L],
    8: [U, U, U],
    9: [U, U, U, R],
  },
  1: {
    A: [R, R, D],
    0: [R, D],
    1: [],
    2: [R],
    3: [R, R],
    4: [U],
    5: [U, R],
    6: [U, R, R],
    7: [U, U],
    8: [U, U, R],
    9: [U, U, R, R],
  },
  2: {
    A: [R, D],
    0: [D],
    1: [L],
    2: [],
    3: [R],
    4: [U, L],
    5: [U],
    6: [U, R],
    7: [U, U, L],
    8: [U, U],
    9: [U, U, R],
  },
  3: {
    A: [D],
    0: [L, D],
    1: [L, L],
    2: [L],
    3: [],
    4: [U, L, L],
    5: [U, L],
    6: [U],
    7: [U, U, L, L],
    8: [U, U, L],
    9: [U, U],
  },
  4: {
    A: [R, R, D, D],
    0: [R, D, D],
    1: [D],
    2: [R, D],
    3: [R, R, D],
    4: [],
    5: [R],
    6: [R, R],
    7: [U],
    8: [R, U],
    9: [R, R, U],
  },
  5: {
    A: [R, D, D],
    0: [D, D],
    1: [L, D],
    2: [D],
    3: [R, D],
    4: [L],
    5: [],
    6: [R],
    7: [U, L],
    8: [U],
    9: [U, R],
  },
  6: {
    A: [D, D],
    0: [D, D, L],
    1: [L, L, D],
    2: [L, D],
    3: [D],
    4: [L, L],
    5: [L],
    6: [],
    7: [L, L, U],
    8: [L, U],
    9: [U],
  },
  7: {
    A: [L, L, D, D, D],
    0: [L, D, D, D],
    1: [D, D],
    2: [R, D, D],
    3: [R, R, D, D],
    4: [D],
    5: [R, D],
    6: [R, R, D],
    7: [""],
    8: [R],
    9: [R, R],
  },
  8: {
    A: [R, D, D, D],
    0: [D, D, D],
    1: [L, D, D],
    2: [D, D],
    3: [R, D, D],
    4: [L, D],
    5: [D],
    6: [R, D],
    7: [L],
    8: [],
    9: [R],
  },
  9: {
    A: [D, D, D],
    0: [L, D, D, D],
    1: [L, L, D, D],
    2: [L, D, D],
    3: [D, D],
    4: [L, L, D],
    5: [L, D],
    6: [D],
    7: [L, L],
    8: [L],
    9: [],
  },
};

/*
    ,---,---,
    | ^ | A |
,---,---,---,
| < | v | > |
,---,---,---,
*/
export const DIRECTIONAL_KEYPAD = {
  A: {
    A: [],
    "^": [L],
    "<": [D, L, L],
    v: [D, L],
    ">": [D],
  },
  "^": {
    A: [R],
    "^": [],
    "<": [D, L],
    v: [D],
    ">": [D, R],
  },
  "<": {
    A: [R, R, U],
    "^": [R, U],
    "<": [],
    v: [R],
    ">": [R, R],
  },
  v: {
    A: [U, R],
    "^": [U],
    "<": [L],
    v: [],
    ">": [R],
  },
  ">": {
    A: [U],
    "^": [U, L],
    "<": [L, L],
    v: [L],
    ">": [],
  },
};
