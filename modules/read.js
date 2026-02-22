import fs from 'node:fs/promises';

export const read = async pathFile => {
  try {
    const result = await fs.readFile(pathFile);
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
};
