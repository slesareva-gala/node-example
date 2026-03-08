import readline from 'node:readline/promises';
import process from 'node:process';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

export const getOptions = async () => {
  try {
    const pathDir = await rl.question('Введите путь к дирректории: ');
    const pattern = await rl.question('Введите строку для поиска: ');
    const replacement = await rl.question('Введите строку для замены: ');
    rl.close();

    return { pathDir, pattern, replacement };
  } catch (e) {
    return null;
  }
};
