import { checkFile, partsFileName } from '../helpers/fileSystem.js';

const dictErrors = {
  114: 'выбирайте файл с расширением gz',
  404: 'файл не найден',
};

export const validate = async args => {
  const command = args.command;
  const filepath = args.file;
  const codeErrors = [];

  if (!(await checkFile(filepath))) codeErrors.push(404);

  if (command === 'unpack' && partsFileName(filepath).ext !== '.gz')
    codeErrors.push(114);

  if (codeErrors.length > 0) {
    console.error(`Ошибка в параметрах команды:\ngz ${command} '${filepath}'`);
    codeErrors.forEach(code => console.error(` - ${dictErrors[code]}`));
  }
  return codeErrors.length === 0;
};
