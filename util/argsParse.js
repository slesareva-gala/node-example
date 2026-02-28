export const argsParse = ([, , ...argv], dict = {}) => {
  if (argv.length === 0) return { command: 'help', params: [] };
  if (!dict.hasOwnProperty(argv[0])) return null;

  const command = argv[0];
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
