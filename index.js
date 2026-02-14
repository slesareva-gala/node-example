import { copyDir } from './modules/copyDir.js';
import { Logger } from './modules/loger.js';

console.log('Задание 1');
await copyDir('source', 'target', err => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('Папка скопирована!');
  }
});

console.log('Задание 2');
const logger = new Logger('log.txt', 1024);

logger.on('messageLogged', message => {
  console.log('Записано сообщение:', message);
});

logger.log('Первое сообщение ' + Date.now());

logger.log('Второе сообщение ' + Date.now());

logger.log('Третье сообщение ' + Date.now());

logger.log('Четвертое сообщение ' + Date.now());
