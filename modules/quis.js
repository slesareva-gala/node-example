import process from 'node:process';
import readline from 'node:readline/promises';

export class Quiz {
  #currentQuestions = 0;
  #correctAnswer = 0;
  #palette = {
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    purple: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
  };

  #say(str, color, newLine = true) {
    process.stdout.write(`${newLine ? '\n' : ''}${color || ''}${str}`);
  }

  constructor(manual, questions) {
    this.manual = manual;
    this.questions = questions;
    this.rl = null;
  }

  start() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    this.#say(
      this.manual || 'Приветствую в квиз! Вводите номера правильных ответов.',
      this.#palette.green,
    );
    this.block();
  }

  stop() {
    const isAllBlock = this.#currentQuestions === this.questions.length - 1;

    this.#say('', this.#palette[isAllBlock ? 'cyan' : 'yellow']);
    this.#say(isAllBlock ? 'Квиз завершен.' : 'Квиз прерван.');

    this.#say(
      `Пройдено блоков квиза - ${this.#currentQuestions + (isAllBlock ? 1 : 0)}`,
    );
    this.#say(
      `Правильных ответов - ${this.#correctAnswer}`,
      this.#palette.green,
    );
    this.#say('');
    this.rl.close();
  }

  next() {
    if (this.#currentQuestions < this.questions.length - 1) {
      this.#currentQuestions++;
      this.block();
    } else this.stop();
  }

  async block() {
    try {
      const n = this.#currentQuestions;
      const block = this.questions[n];

      this.#say('', this.#palette.cyan);
      this.#say(`Вопрос ${n + 1}: ${block.question}`);
      this.#say('', this.#palette.white, false);
      this.#say(`Варианты ответов:`);
      block.options.forEach((option, i) => {
        this.#say(`${i + 1}. ${option}`);
      });

      this.#say('', this.#palette.cyan, false);
      const answer = +(await this.rl.question('Ваш ответ: '));

      if (this.validate(answer, block.options.length)) {
        if (answer === block.correctIndex + 1) {
          this.#say('Правильный ответ!', this.#palette.green, false);
          this.#correctAnswer++;
          this.next();
        } else {
          this.#say('Не правильный ответ.', this.#palette.red, false);
          this.next();
        }
      } else this.block();
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
