import multer from 'multer';

const INAGES_DIR = process.env.INAGES_DIR || './images';

const UPLOAD_IMAGE_MESSAGE = 'Ошибка загрузки. Изображение не сохранено.';
const UPLOAD_FORMAT_IMAGE_MESSAGE = 'Ошибка обработки изображения';
const IMAGE_UPLOADED_MESSAGE = 'Изображение успешно сохранено';

const storage = multer.diskStorage({
  destination: INAGES_DIR,
  filename(req, file, cb) {
    const ext = file.originalname.split('.').pop();
    const filename = `image_${Date.now()}.${ext}`;
    cb(null, filename);
  },
});

const upload = multer({ storage });

export const uploadFD = async (req, res) => {
  const uploadSingle = upload.single('file');

  uploadSingle(req, res, e => {
    if (e instanceof multer.MulterError) {
      console.error(UPLOAD_FORMAT_IMAGE_MESSAGE);
      res.statusCode = 400;
      return res.end(JSON.stringify({ message: UPLOAD_FORMAT_IMAGE_MESSAGE }));
    }

    if (e) {
      console.error(
        `Ошибка записи в папку ${INAGES_DIR}. Изображение не сохранено.`,
      );
      res.statusCode = 500;
      return res.end(JSON.stringify({ message: UPLOAD_IMAGE_MESSAGE }));
    }

    const pathFile = `${INAGES_DIR}/${req.file.filename}`;
    console.log(`Изображение сохранено: ${pathFile}`);
    res.statusCode = 200;
    return res.end(JSON.stringify({ message: IMAGE_UPLOADED_MESSAGE }));
  });
};
