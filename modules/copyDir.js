import { readdir, stat, mkdir, copyFile } from 'node:fs/promises';

const errors = ({ oError, callback }) => {
  const dict = {
    ESD: 'некорректный путь дирректории для копирования',
    ETD_EEXIST: 'необучена корректно копировать в уже существующую директорию',
    ETD_ENOENT: 'невозможно создать дирректорию для копии',
    ETD_ERR_INVALID_ARG_TYPE: 'некорректный путь дирректории для копии',
  };

  callback(
    new Error(
      `${oError.code}: ${dict[oError.code] || 'ошибка не описана'}, copyDir '${oError.message}'`,
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

async function dictDir(path) {
  const dict = [];
  const listDir = await readdir(path);

  for (const name of listDir) {
    dict.push(await statFile(path + name));
  }

  return dict;
}

async function dictAllFiles(path) {
  const dictAll = [];
  const directories = [await statFile(path)];

  while (directories.length) {
    const newDir = [];
    for (const el of directories) {
      const dict = await dictDir(`${el.file}/`);
      newDir.push(...dict.filter(o => o.type === 'D'));
      dictAll.push(
        ...dict.map(o => ({ ...o, file: o.file.slice(path.length) })),
      );
    }
    directories.length = 0;
    directories.push(...newDir);
  }

  return dictAll;
}

export const copyDir = async (
  sourceDir,
  targetDir,
  callback = err => (err ? err : null),
) => {
  try {
    if ((await statFile(sourceDir)).type !== 'D')
      throw { code: 'ESD', message: sourceDir };

    try {
      await mkdir(targetDir, { recursive: true });
    } catch (err) {
      throw { code: 'ETD_' + err.code, message: targetDir };
    }

    if (sourceDir.slice(-1) === '/')
      sourceDir = sourceDir.slice(0, sourceDir.length - 1);
    if (targetDir.slice(-1) === '/')
      targetDir = targetDir.slice(0, targetDir.length - 1);

    const listDir = await dictAllFiles(sourceDir);

    if (listDir.length) {
      for (const el of listDir) {
        if (el.type === 'D') {
          await mkdir(targetDir + el.file, { recursive: true });
        } else if (el.type === 'F') {
          await copyFile(sourceDir + el.file, targetDir + el.file);
        }
      }
    }

    callback(null);
  } catch (oError) {
    errors({ oError, callback });
  }
};
