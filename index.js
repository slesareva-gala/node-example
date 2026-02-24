import { createWriteStream, createReadStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import sharp from './modules/sharp.cjs';

async function resizeImage(inputPath, outputPath) {
  try {
    await pipeline(
      createReadStream(inputPath),
      sharp().resize(400, 400),
      createWriteStream(outputPath),
    );
  } catch (e) {
    console.error('resizeImage: ', e.message);
  }
}

async function blurredGgrayImage(inputPath, outputPath) {
  try {
    await pipeline(
      createReadStream(inputPath),
      sharp().greyscale().blur(3),
      createWriteStream(outputPath),
    );
  } catch (e) {
    console.error('blurredGgrayImage: ', e.message);
  }
}

resizeImage('./files/horse.jpeg', './files/horseMini.jpeg');
blurredGgrayImage('./files/horse.jpeg', './files/horseBG.jpeg');
