import { cloudinary } from "./cloudinary.client";

export type UploadedImage = {
  url: string;
  publicId: string;
};

export function uploadImage(
  buffer: Buffer,
  folder: string,
): Promise<UploadedImage> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(new Error("Cloudinary upload failed."));
          return;
        }

        resolve({ url: result.url, publicId: result.public_id });
      },
    );
    uploadStream.end(buffer);
  });
}

export async function deleteImage(publicId: string): Promise<void> {
  const result = await cloudinary.uploader.destroy(publicId, {
    resource_type: "image",
  });

  if (result.result !== "ok") {
    throw new Error(`Failed to delete image from Cloudinary: ${result.result}`);
  }
}
