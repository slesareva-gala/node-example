import { read } from './modules/read.js';
import { Quiz } from './modules/quis.js';

const questions = JSON.parse(await read('./data/question.json'));

const quizJS = new Quiz(
  `Приветствуем на квизе по JavaScript и Node.js.

Для каждого вопроса квиза будут предоставлены три варианта ответа.
из которых только один верный.

Решите какой вариант ответа считаете правильным,
и введите его номер после сообщения "Ваш ответ:", нажмите Enter.
Жмите Ctrl-C, если хотите выйти из квиза.

Желаем вам правильных ответов на все ${questions.length} вопросов!
`,
  questions,
  'progress',
);

quizJS.start();
