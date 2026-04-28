import { access, writeFile, mkdir } from 'node:fs/promises';

const checkFile = async filepath => {
  try {
    await access(filepath);
    return true;
  } catch {
    return false;
  }
};

const createDir = async filepath => {
  try {
    const createdDir = await mkdir(filepath);
    return true;
  } catch {
    return false;
  }
};

export const accessDir = async dir => {
  if (await checkFile(dir)) return true;
  return await createDir(dir);
};

export const writeImage64 = async (pathFile, image64) => {
  try {
    await writeFile(pathFile, image64, {
      encoding: 'base64',
    });
    return true;
  } catch (e) {
    console.error('writeImage64: ', e.message);
    return false;
  }
};
