import { createWriteStream, createReadStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { createGzip, createGunzip } from 'node:zlib';

export async function archiver(inputPath, outputPath, command) {
  const createPack = command === 'pack' ? createGzip : createGunzip;
  try {
    await pipeline(
      createReadStream(inputPath),
      createPack(),
      createWriteStream(outputPath),
    );
    return true;
  } catch (e) {
    console.error('archiver: ', e.message);
    return false;
  }
}
