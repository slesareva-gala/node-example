export const argsParse = ([, , ...argv]) => {
  const args = {};
  let key = 'err';

  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '-h') {
      args.h = true;
      break;
    }
    if (argv[i][0] === '-') {
      key = argv[i].slice(1);
      args[key] = '';
      continue;
    }
    if (key === 'err') continue;

    if (args[key].length > 0) args[key] += ' ';
    args[key] += argv[i];
  }

  return args;
};
