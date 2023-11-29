import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";

/**
 * Read a file and return the contents
 * @param path 
 * @returns string
 */
export const readFile = (path: string): string => {
  if (!existsSync(path)) {
    writeFileSync(path, ``, { encoding: 'utf-8' });
  }
  return readFileSync(path, "utf8").trim();
};

/**
 * Copy code template file to the specified folder
 * @param folder 
 */
export const generateCodeFile = (folder: string): void => {
  mkdirSync(folder, { recursive: true });
  copyFileSync(`${__dirname}/template.ts`, `${folder}/index.ts`);
};
