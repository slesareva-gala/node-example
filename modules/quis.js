import process from 'node:process';
import readline from 'node:readline/promises';

import { st, say, newline, clear, pos, box } from './design.js';

export class Quiz {
  #currentQuestions = 0;
  #qtyAnswer = 0;
  #correctAnswer = 0;
  #processAnswer = '';
  #rl = null;

  constructor(manual, questions, mode) {
    this.manual = manual;
    this.questions = questions;
    this.mode = mode === 'progress';
  }

  start() {
    this.#rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    if (!this.mode) this.sayManual();
    this.next(0);
  }

  next(i = 1) {
    if (this.#currentQuestions < this.questions.length - 1) {
      this.#currentQuestions += i;
      this.block();
    } else this.stop();
  }

  stop() {
    this.sayResult();
    this.#rl.close();
  }

  sayManual() {
    say(
      this.manual || 'Приветствую в квиз! Вводите номера правильных ответов.',
      'green',
    );
  }

  sayProcess() {
    const qty = this.questions.length;
    box(1, 1, 6, Math.max(22, qty + 12), 'magenta');
    pos(2, 4);
    say(
      `Ответов: ${this.#qtyAnswer} из ${this.questions.length}`,
      'cyan',
      false,
    );
    box(3, 4, 3, qty + 6, 'magenta');
    pos(4, 7);
    say(''.padStart(qty), 'bgGray', false);
    pos(4, 7);
    say(this.#processAnswer, '', false);
    pos(7, 1);
  }

  sayBlockResult(isCorrect) {
    if (isCorrect) {
      say('Правильный ответ!', 'green', false);
      this.#correctAnswer++;
      if (this.mode) this.#processAnswer += st(' ', 'bgGreen');
    } else {
      say('Не правильный ответ.', 'red', false);
      if (this.mode) this.#processAnswer += st(' ', 'bgRed');
    }
    this.#qtyAnswer++;
  }

  sayResult() {
    const isAllBlock = this.#qtyAnswer === this.questions.length;
    const messageText = isAllBlock ? 'КВИЗ ЗАВЕРШЕН:' : 'КВИЗ ПРЕРВАН:';
    const messageColor = isAllBlock ? 'cyan' : 'yellow';

    if (this.mode) {
      clear();
      this.sayProcess();
    } else newline();

    say(messageText, messageColor + 'Bright');

    say(`- всего вопросов ....... ${this.questions.length}`, messageColor);
    say(`- всего ответов ........ ${this.#qtyAnswer}`, messageColor);
    say(`- правильных ответов ... ${this.#correctAnswer}`, 'greenBright');
    newline();
  }

  async getBlock(n, block) {
    say(`Вопрос ${n + 1}: ${block.question}`, 'cyan');
    say(`Варианты ответов:`, 'white');
    block.options.forEach((option, i) => {
      say(`${i + 1}. ${option}`);
    });
    newline(this.mode + 1);
    return +(await this.#rl.question(st('Ваш ответ: ', 'cyan')));
  }

  async block() {
    try {
      const n = this.#currentQuestions;
      const block = this.questions[n];

      if (this.mode) {
        clear();
        if (n === 0) this.sayManual();
        else this.sayProcess();
      } else newline();

      const answer = await this.getBlock(n, block);
      const isValid = this.validate(answer, block.options.length);

      if (isValid) this.sayBlockResult(answer === block.correctIndex + 1);
      this.next(isValid + 0);
    } catch (e) {
      this.stop();
      if (e.code !== 'ABORT_ERR') {
        console.error(e);
      }
    }
  }

  validate(value, maxValue) {
    if (isNaN(value)) return false;

    const validValues = Array.from({ length: maxValue }, (_, i) => i + 1);
    return validValues.includes(value);
  }
}
