import fs from 'node:fs/promises';

export const write = async (pathFile, data) => {
  try {
    await fs.writeFile(pathFile, data);
    return true;
  } catch (err) {
    throw new Error(err.message);
  }
};
