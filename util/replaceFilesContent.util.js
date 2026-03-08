import { createReadStream, createWriteStream } from 'node:fs';
import { rename } from 'node:fs/promises';
import { createInterface } from 'node:readline/promises';
import { EOL } from 'node:os';

import { findFiles } from './findFiles.util.js';

const replaceFile = async (targetPath, pattern, replacement) => {
  const tempPath = targetPath + '.tmp';
  try {
    const rl = createInterface({
      input: createReadStream(targetPath, { encoding: 'utf-8' }),
      output: createWriteStream(tempPath, { encoding: 'utf-8' }),
      crlfDelay: Infinity,
    });
    for await (const line of rl) {
      rl.output.write(line.replaceAll(pattern, replacement) + EOL);
    }
    await rl.input.close();
    await rl.output.close();
    await rename(tempPath, targetPath);
  } catch (e) {
    throw new Error(`replaceStreamFile: ${e}`);
  }
};

export const replaceFilesContent = async (
  directorySearch,
  pattern,
  replacement,
  typeTarget = 'txt',
) => {
  try {
    const testMaskFile = new RegExp(`.+\\.${typeTarget}$`);

    const listFiles = await findFiles({
      pathDir: directorySearch,
      maskFile: testMaskFile,
      callback: e => {
        if (e) {
          throw new Error(`findFiles: ${e.message}`);
        }
      },
    });

    for (const pathFile of listFiles) {
      try {
        await replaceFile(pathFile, pattern, replacement);
      } catch (e) {
        throw new Error(`Замена текста в файлах прервана: ${e.message}`);
      }
    }
    console.log('Замена текста в файлах успешно зваершена');
  } catch (e) {
    console.error(`Замена текста в файлах прервана: ${e.message}`);
  }
};
