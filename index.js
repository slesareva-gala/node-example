import { EventEmitter } from 'node:events';

// ЗАДАНИЕ 1
class TimerTick extends EventEmitter {
  constructor() {
    super();
    this.tick = 0;
    this.id = -1;
  }
  start(ms = 1000) {
    this.stop(this.id);
    this.id = setInterval(() => {
      this.tick++;
      this.show();
    }, ms)[Symbol.toPrimitive]();
  }

  show() {
    console.log(`Tick - ${this.tick}`);
  }

  stop() {
    if (this.id > -1) {
      clearInterval(this.id);
      this.tick = 0;
      this.id = -1;
    }
  }
}

const timerTick = new TimerTick();

timerTick.start(500);

setTimeout(() => {
  timerTick.start();
}, 2500);

setTimeout(() => {
  timerTick.stop();
}, 7000);

// ЗАДАНИЕ 2
class Messager extends EventEmitter {}
const messager = new Messager();

const receiveMessage = ({ userName, message }) => {
  console.log(`${userName}: ${message}`);
};
messager.on('mess', receiveMessage);

const sendMessage = (userName, message) => {
  messager.emit('mess', { userName, message });
};

setTimeout(() => {
  sendMessage('Node', 'Hello, Gala!');
}, 2050);
setTimeout(() => {
  sendMessage('Gala', 'Hello, Node!');
}, 2100);
setTimeout(() => {
  sendMessage('Node', 'Учись, студент! Солнце ещё не взошло.');
}, 7050);
