#!/usr/bin/env node
import { replaceFilesContent } from './util/replaceFilesContent.util.js';
import { getOptions } from './util/getOptions.util.js';

console.log('Замена одной подстроки на другую в txt-файлах дирретория:\n');
const options = await getOptions();
if (options && options.pathDir && options.pattern && options.replacement)
  await replaceFilesContent(
    options.pathDir,
    options.pattern,
    options.replacement,
  );
else console.log('\nЗамена не произведена');
