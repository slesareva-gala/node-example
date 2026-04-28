import { accessDir, writeImage64 } from '../helpers/fileSystem.js';

const INAGES_DIR = process.env.INAGES_DIR || './images';

const UPLOAD_IMAGE_MESSAGE = 'Ошибка загрузки. Изображение не сохранено.';
const UPLOAD_FORMAT_IMAGE_MESSAGE =
  'Недопустимый формат изображения. Загружайте файлы с расширением png, svg или jpеg(jpg).';
const IMAGE_UPLOADED_MESSAGE = 'Изображение успешно сохранено';

const upload = async (req, res, base64, format) => {
  if (!(await accessDir(INAGES_DIR))) {
    console.log(`Нет доступа к папке ${INAGES_DIR}`);
    res.statusCode = 500;
    return res.end(JSON.stringify({ message: UPLOAD_IMAGE_MESSAGE }));
  }

  const ext = format === 'svg+xml' ? 'svg' : format === 'jpeg' ? 'jpg' : format;

  const base64Image = base64.split(';base64,')[1];
  const pathFile = `${INAGES_DIR}/${`image_${Date.now()}.${ext}`}`;

  if (!(await writeImage64(pathFile, base64Image))) {
    console.error(
      `Ошибка записи в папку ${INAGES_DIR}. Изображение не сохранено.`,
    );
    res.statusCode = 500;
    return res.end(JSON.stringify({ message: UPLOAD_IMAGE_MESSAGE }));
  }

  console.log(`Изображение сохранено: ${pathFile}`);
  res.statusCode = 200;
  return res.end(JSON.stringify({ message: IMAGE_UPLOADED_MESSAGE }));
};

export const upload64 = (req, res) => {
  let data = '';
  req.on('data', chunk => {
    data += chunk;
  });

  req.on('end', async () => {
    const { base64Data } = JSON.parse(data);
    const format = base64Data.match(/^data:image\/([a-z+]+);base64,/i)[1];

    if (['png', 'svg+xml', 'jpeg'].includes(format)) {
      return await upload(req, res, base64Data, format);
    }
    console.error(
      `Формат файлов ${format} не обрабатывается. Изображение не сохранено.`,
    );
    res.statusCode = 400;
    return res.end(JSON.stringify({ message: UPLOAD_FORMAT_IMAGE_MESSAGE }));
  });
};
