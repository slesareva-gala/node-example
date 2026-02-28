export const validate = args => {
  const params = args.params;
  const toValidString = s => s.trim().replace(/\s{2,}/gi, ' ');
  let errors = false;

  if (params.includes('id')) {
    const id = +args.id;
    const isErr = isNaN(id) || id < 1 || args.id.includes('.');

    args.id = isErr ? `<err: ${args.id || 'ид'}>` : id;
    errors = errors || isErr;
  }

  const isNewTask = params.includes('newTask');
  if (params.includes('task') || isNewTask) {
    const param = isNewTask ? 'newTask' : 'task';
    const task = toValidString(args[param]);
    const isErr = task.length === 0;

    args[param] = isErr ? `<err: задача>` : task;
    errors = errors || isErr;
  }

  if (params.includes('status')) {
    const status = toValidString(args.status).slice(0, 15);
    const isErr = status.length === 0;

    args.status = isErr ? `<err: статус>` : status;
    errors = errors || isErr;
  }

  if (errors)
    console.log(
      `Ошибка в параметрах команды:\ntodo ${args.command}${params.reduce(
        (s, param) => {
          return s + ` ${args[param]}`;
        },
        '',
      )}`,
    );
  return !errors;
};
