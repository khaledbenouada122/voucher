import { diskStorage } from 'multer';
import { extname } from 'path';

export const storageConfig = {
  storage: diskStorage({
    destination: './uploads',  // Directory where files will be stored
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);  // Get file extension
      callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);  // Naming the file
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },  // Limit file size to 10MB (optional)
};
