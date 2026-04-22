export const argsParse = ([, , ...argv], dict = {}) => {
  const command = argv[0];
  if (!dict.hasOwnProperty(command)) return null;

  const param = dict[command];
  const parsed = { command };
  if (param) parsed[param] = argv[1] || '';

  return parsed;
};
