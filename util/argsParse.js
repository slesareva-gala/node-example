export const argsParse = ([, , ...argv], dict = {}) => {
  // if (argv.length === 0) return { command: 'help', params: [] };

  const command = argv[0];
  if (!dict.hasOwnProperty(command)) return null;

  const params = dict[command].split(',').map(name => name.trim());

  return params.reduce(
    (o, param, i) => {
      if (param === 'id') o[param] = argv[i + 1] || '';
      else if (param) o[param] = argv.filter((v, j) => j > i && v).join(' ');
      return o;
    },
    { command, params },
  );
};
