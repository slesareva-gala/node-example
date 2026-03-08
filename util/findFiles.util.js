import { readdir, stat } from 'node:fs/promises';

const errors = ({ oError, callback }) => {
  const dict = {
    ESD: 'некорректный путь к каталогу',
  };

  callback(
    new Error(
      `${oError.code}: ${dict[oError.code] || 'ошибка не описана'}: ${oError.message}`,
    ),
  );
};

async function statFile(file) {
  try {
    const stats = await stat(file);
    return {
      file,
      type: stats.isFile()
        ? 'F'
        : stats.isDirectory()
          ? 'D'
          : stats.isSymbolicLink()
            ? 'S'
            : 'U',
      size: stats.size,
    };
  } catch (err) {
    return { file, type: 'U', size: null };
  }
}

async function readingDir(path) {
  const dict = [];
  const listDir = await readdir(path);

  for (const name of listDir) {
    dict.push(await statFile(path + name));
  }

  return dict;
}

async function dictAllFiles(path, mask, isStat) {
  const dictFiles = [];
  const dictDirs = [await statFile(path)];
  const dir = dictDirs.slice();

  while (dir.length) {
    const addDir = [];
    for (const el of dir) {
      const dict = await readingDir(`${el.file}/`);
      addDir.push(...dict.filter(o => o.type === 'D'));
    }
    dir.length = 0;
    dictDirs.push(...addDir);
    dir.push(...addDir);
  }
  dictDirs.sort(
    (a, b) => (a.file < b.file && -1) || (a.file > b.file && 1) || 0,
  );

  for (const el of dictDirs) {
    const dict = await readingDir(`${el.file}/`);
    dictFiles.push(
      ...dict
        .filter(o => o.type === 'F' && mask.test(o.file))
        .map(o => (isStat ? o : o.file)),
    );
  }
  return dictFiles;
}

export const findFiles = async ({
  pathDir,
  maskFile = /.+/,
  withStat = false,
  callback = err => (err ? err : null),
}) => {
  try {
    if ((await statFile(pathDir)).type !== 'D')
      throw { code: 'ESD', message: `'${pathDir}'` };

    if (pathDir.slice(-1) === '/')
      pathDir = pathDir.slice(0, pathDir.length - 1);

    const listDir = await dictAllFiles(pathDir, maskFile, withStat);

    callback(null);
    return listDir;
  } catch (oError) {
    errors({ oError, callback });
  }
};
