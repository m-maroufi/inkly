import mutler from "multer";
import { AppError } from "../shared/errors/app-error";

const storage = mutler.memoryStorage();

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

export const upload = mutler({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
    fields: 10,
  },
  fileFilter: (_req, file, callback) => {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      callback(
        new AppError("Only JPEG, PNG, and WebP images are allowed.", 400),
      );
      return;
    }
    callback(null, true);
  },
});
