import process from 'node:process';
import { styleText } from 'node:util';

export const st = (message, styles = '') => {
  const aStyles = styles
    .split(',')
    .map(s => s.trim())
    .filter(s => s);
  return styleText(aStyles, message);
};

export const say = async (message, styles = '', newline = true) => {
  const stMessage = st(message, styles);
  await process.stdout.write(`${newline ? '\n' : ''}${stMessage}`);
};

export const newline = (qty = 1) => {
  process.stdout.write('\n'.repeat(qty));
};

export const clear = () => {
  pos(1, 1);
  say('\x1Bc');
};

export const pos = (row, col) => say(`\x1b[${row};${col}H`);

export const box = (row, col, heigth, width, styles = '') => {
  const border = ['┌', '─', '┐', '│', '┘', '└'];
  const w = width - 2;
  const h = heigth - 1;

  pos(row, col);
  say(border[0] + border[1].repeat(w) + border[2], styles, false);
  for (let i = 1; i < h; i++) {
    pos(row + i, col);
    say(border[3] + ' '.repeat(w) + border[3], styles, false);
  }
  pos(row + h, col);
  say(border[5] + border[1].repeat(w) + border[4], styles, false);
};
