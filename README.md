# Урок 6

Примеры и задания курса "Backend на Node.js" GLO Academy

## ЗАДАНИЕ 1

### Создайте функции для кодирования и декодирования текста из различных кодировок в буфер и наоборот.

<i><b>Например, переведите текст из UTF-8 в Base64 и обратно.</b></i><br>

```js
const textToBuffer = (text, encoding) => {
  // Ваше решение, преобразование текста в буфер с заданной кодировкой
};

const bufferToText = (buffer, encoding) => {
  // Ваше решение, декодирование буфера в текст с заданной кодировкой
};

// Проверка решения
const text = 'Привет, мир!';
const utf8Buffer = textToBuffer(text, 'utf-8');
console.log(utf8Buffer);

const decodedText = bufferToText(utf8Buffer, 'utf-8');
console.log(decodedText); // Выведет: Привет, мир!
```
