import { createWriteStream, createReadStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';

import { findFiles } from './findFiles.js';

export const combineFilesContent = async (
  directorySearch,
  nameFileTarget,
  typeTarget = 'txt',
) => {
  try {
    const testMaskFile = new RegExp(`.+\\.${typeTarget}$`);
    const fileTarget = `${directorySearch.replace(/(.*\/)(.+)/, '$1')}${nameFileTarget}.${typeTarget}`;

    const listFiles = await findFiles({
      pathDir: directorySearch,
      maskFile: testMaskFile,
      callback: e => {
        if (e) {
          throw new Error(`findFiles: ${e.message}`);
        }
      },
    });

    const readStreamAsync = async (path, wStream) => {
      try {
        await pipeline(
          createReadStream(path, { encoding: 'utf-8' }),
          async function (rStream) {
            for await (let chunk of rStream) {
              wStream.write(chunk);
            }
          },
        );
      } catch (e) {
        throw new Error(`readStreamAsync: ${e.message}`);
      }
    };

    const wStream = createWriteStream(fileTarget, {
      encoding: 'utf-8',
      highWaterMark: 256,
    });

    for (const pathFile of listFiles) {
      try {
        wStream.write(`[${[pathFile.replace(/^(.*\/)(.+)(.txt)/, '$2')]}]\n`);
        await readStreamAsync(pathFile, wStream);
      } catch (e) {
        wStream.close();
        throw new Error(`Запись прервана: ${e.message}`);
      }
    }
    wStream.close();
  } catch (e) {
    console.error(e);
  }
};
