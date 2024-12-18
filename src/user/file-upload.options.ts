import { MulterModuleOptions } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';

export class FileUploadOptions {
  createMulterOptions(): MulterModuleOptions {
    return {
      storage: diskStorage({
        destination: './uploads', 
        filename: (req, file, callback) => {
          
          const fileExtension = path.extname(file.originalname);
          const fileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${fileExtension}`;
          callback(null, fileName);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024, 
      },
      fileFilter: (req, file, callback) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedTypes.includes(file.mimetype)) {
          return callback(new Error('Invalid file type'), false);
        }
        callback(null, true);
      },
    };
  }
}
