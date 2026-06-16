import multer from 'multer';

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
});

export const fileToDataUri = (file) => {
  if (!file) return '';
  return `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
};
