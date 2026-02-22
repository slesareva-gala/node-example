import iconv from 'iconv-lite';
import { read } from './modules/read.js';
import { write } from './modules/write.js';

const textToBuffer = (text, encoding) => {
  return iconv.encode(text, encoding);
};

const bufferToText = (buffer, encoding) => {
  return iconv.decode(buffer, encoding);
};

// все строки javascript уже декодированы utf-8 (utf-16) и не должны декодироваться повторно
const text = 'Привет, мир!';
console.log('text: ', text);
const utf8Buffer = textToBuffer(text, 'utf-8');
console.log('utf8Buffer: ', utf8Buffer);
const decodedText = bufferToText(utf8Buffer, 'utf-8');
console.log('decodedText: ', decodedText, '\n');

const textBase64 = Buffer.from(text, 'utf-8').toString('base64');
console.log('textBase64: ', textBase64);
const base64Buffer = textToBuffer(textBase64, 'base64');
console.log('base64Buffer: ', base64Buffer);
const base64Text = bufferToText(base64Buffer, 'base64');
console.log('base64Text: ', base64Text, '\n');

const textCP866 = iconv.decode(Buffer.from(text, 'utf-8'), 'cp866');
console.log('textCP866: ', textCP866);
const cp866Buffer = textToBuffer(textCP866, 'cp866');
console.log('cp866Buffer: ', cp866Buffer);
const cp866Text = bufferToText(cp866Buffer, 'cp866');
console.log('cp866Text: ', cp866Text, '\n');

// из файла в кодировке cp866 в строку utf-8
const cp866BufferExcel = await read('./files/Excel866.csv', 'cp866');
console.log('cp866BufferExcel: ', cp866BufferExcel);
const utf8TextExcel = bufferToText(cp866BufferExcel, 'cp866');
console.log('utf8TextExcel: ', utf8TextExcel, '\n');

// из строки utf-8 в файл cp866
const bufferExcel = textToBuffer(`${utf8TextExcel}\nПривет, мир!`, 'cp866');
await write('./files/Excel.csv', bufferExcel);
