import { styleText } from 'node:util';

export const sayError = message =>
  console.error(styleText(['red', 'bold'], message));

export const sayTitle = message =>
  console.error(styleText(['cyan', 'bold'], message));

export const sayComment = message =>
  console.error(styleText(['gray'], message));
