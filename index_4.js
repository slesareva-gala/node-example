const now = Date.now();

setTimeout(() => {
  console.log('#1 setTimeout 0', now - Date.now());
}, 0);

const timerID1 = setInterval(() => {
  clearInterval(timerID1);
  console.log('#2 setInterval', now - Date.now());
}, 0);

setTimeout(() => {
  console.log('#3 setTimeout 1', now - Date.now());
}, 1);

setTimeout(() => {
  console.log('#4 setTimeout 0', now - Date.now());
}, 0);

setImmediate(() => {
  console.log('#5 setImmediate', now - Date.now());
}, 0);

setTimeout(() => {
  console.log('#6 setTimeout', now - Date.now());
}, 0);

setImmediate(() => {
  console.log('#7 setImmediate', now - Date.now());
}, 0);

const timerID2 = setInterval(() => {
  clearInterval(timerID2);
  console.log('#8 setInterval', now - Date.now());
}, 0);

process.nextTick(() => {
  console.log('#9 process.nextTick', now - Date.now());
});

process.nextTick(() => {
  console.log('#10 process.nextTick', now - Date.now());
});