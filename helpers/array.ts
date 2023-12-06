/**
 * Add an item to an array if it doesn't already exist
 * @param array
 * @param item
 */
export const addUniqueItem = (array: any[], item: any): void => {
  if (!array.includes(item)) {
    array.push(item);
  }
};

/**
 * Output a 2d array to the console
 * @param array
 */
export const print2d = (array: any[][]): void => {
  console.log(array.map((row) => row.join('')).join('\n'));
};
