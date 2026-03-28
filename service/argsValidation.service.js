import { sayError } from './sayMessage.service.js';

const reQuery = /[&=]/;
const languages = 'ar de en es fr he it nl no pt ru sv ud zh';
const categorys =
  'business entertainment general health science sports technology';
const pageSizeMax = 100;

export const argsValidation = args => {
  const pageSize = +args.s || 0;
  let errCode = [];

  if (args.q && reQuery.test(args.q))
    errCode.push('-q не может содержать символы & или =');
  if (!languages.split(' ').includes(args.l))
    errCode.push(`-l допустимые варианты: ${languages}`);
  if (args.c && !categorys.split(' ').includes(args.c))
    errCode.push(`-c допустимые варианты: ${categorys}`);
  if (pageSize < 1 || pageSize > pageSizeMax || pageSize % 1)
    errCode.push(`-s допустимо целое число от 1 до ${pageSizeMax}`);

  if (errCode.length > 0) {
    sayError('Ошибочные параметры:');
    errCode.forEach(err => {
      sayError(err);
    });
  }

  return errCode.length === 0;
};
