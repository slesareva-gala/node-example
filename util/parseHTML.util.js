import { styleText } from 'node:util';
import { JSDOM } from 'jsdom';

export const parseHTML = htmlString => {
  if (!htmlString) return [];

  const tags = 'h1,h2,h3,h4,h5,h6,a';

  const dom = new JSDOM(htmlString);
  const document = dom.window.document;

  const data = [...document.querySelectorAll(tags)].map(el => {
    const tag = {
      tag: el.tagName.toLowerCase(),
      text: el.textContent
        .split('\n')
        .map(el => el.trim())
        .filter(el => el)
        .join(' '),
    };
    if (el.href) tag.href = el.href;
    return tag;
  });
  return data;
};

export const outResultParse = async (data, urlString = '') => {
  const tags = 'h1,h2,h3,h4,h5,h6,a'.split(',');

  if (urlString) {
    console.log(
      styleText(
        ['yellowBright', 'bold', 'bgGrey'],
        `\n\n  Парсинг: ${urlString}\n`,
      ),
    );
  }

  tags.forEach(tag => {
    const tagData = data.filter(el => el.tag === tag);
    if (tagData.length) {
      console.log(
        styleText(
          ['yellowBright', 'bold'],
          `\n${tag === 'a' ? 'Ссылки' : 'Заголовки'} <${tag}>`,
        ),
      );
      tagData.forEach((o, i) => {
        console.log(`${i + 1}. "${o.text}"${o.href ? `: '${o.href}'` : ''}`);
      });
    }
  });
};
