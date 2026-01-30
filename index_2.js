const fs = require('node:fs');

fs.readFile('./text.txt', 'utf8', (err, data) => {
    console.log('A readFile', performance.now());

    setTimeout(() => {
      console.log('H setTimeout read', performance.now());
    }, 0);
    setImmediate(() => {
      console.log('I setImmediate read', performance.now());
    });
});

setTimeout(() => {
  console.log('B setTimeout', performance.now());
});

setTimeout(() => {
  console.log('C setTimeout 100', performance.now());
}, 100);

setTimeout(() => {
  console.log('D setTimeout 0', performance.now());
}, 0);

setImmediate(() => {
  console.log('E setImmediate', performance.now());
});

fs.writeFile('text.txt', 'Hello Node.js', 'utf8', () => {
  console.log('F writeFile', performance.now());
});

console.log('G console.log', performance.now());