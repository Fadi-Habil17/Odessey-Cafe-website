import multer from "multer";
import path from "path";
import cloudinary, { isCloudinaryConfigured } from "../config/cloudinary";

const storage = multer.memoryStorage();

function fileFilter(
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const isValidExt = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const isValidMime = allowedTypes.test(file.mimetype);

  if (isValidExt && isValidMime) {
    cb(null, true);
  } else {
    cb(new Error("يُسمح فقط برفع صور بصيغة JPG, PNG أو WEBP"));
  }
}

export const uploadImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

export async function uploadToCloudinary(
  file: Express.Multer.File,
): Promise<string> {
  if (!file) {
    throw new Error("لا توجد صورة مرفوعة");
  }

  if (
    "secure_url" in file &&
    typeof file.secure_url === "string" &&
    file.secure_url
  ) {
    return file.secure_url;
  }

  if (!isCloudinaryConfigured) {
    throw new Error(
      "لم يتم تهيئة Cloudinary. أضف CLOUDINARY_CLOUD_NAME و CLOUDINARY_API_KEY و CLOUDINARY_API_SECRET إلى متغيرات البيئة.",
    );
  }

  const result = await new Promise<{ secure_url: string }>(
    (resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "odessey/menu-items",
          resource_type: "image",
        },
        (error, uploaded) => {
          if (error) {
            reject(error);
            return;
          }

          if (!uploaded || !uploaded.secure_url) {
            reject(new Error("فشل في رفع الصورة إلى Cloudinary"));
            return;
          }

          resolve(uploaded);
        },
      );

      stream.end(file.buffer);
    },
  );

  return result.secure_url;
}
