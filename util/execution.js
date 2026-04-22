import { partsFileName } from '../helpers/fileSystem.js';
import { archiver } from './archiver.js';
import { writeHash, compareHash } from './hashing.js';

const fileNames = (command, filepath) => {
  let { dir, name, ext, sep } = partsFileName(filepath);
  const basename =
    dir + sep + name + (command === 'pack' ? '_' + ext.slice(1) : '');
  if (command === 'unpack') {
    const arr = name.split('_');

    ext = arr.length > 1 ? arr.pop() : '';
    if (ext) ext = '.' + ext;
    name = arr.join('') + '(1)';
  }

  const fileOrig = dir + sep + name + ext;
  const fileHash = basename + '.sha256';
  const fileArch = basename + '.gz';

  return { fileOrig, fileHash, fileArch };
};

export const execution = async args => {
  const command = args.command;
  const itPacks = command === 'pack';
  const { fileOrig, fileHash, fileArch } = fileNames(command, args.file);

  if (itPacks) {
    if (!(await writeHash(fileOrig, fileHash))) return;
    console.log(`- хеш сохранен в файле: ${fileHash}`);
  }

  const inputPath = itPacks ? fileOrig : fileArch;
  const outputPath = itPacks ? fileArch : fileOrig;

  if (await archiver(inputPath, outputPath, command)) {
    console.log(`- coздан файл: ${outputPath}\n`);
    if (!itPacks) await compareHash(outputPath, fileHash);
  }
};
