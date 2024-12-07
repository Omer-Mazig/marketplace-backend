import { Injectable, RequestTimeoutException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';
import { Express } from 'express'; // Import Express for Multer types

@Injectable()
export class UploadToCloudinaryProvider {
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get('appConfig.cloudinaryCloudName'),
      api_key: this.configService.get('appConfig.cloudinaryApiKey'),
      api_secret: this.configService.get('appConfig.cloudinaryApiSecret'),
    });
  }

  public async fileUpload(file: Express.Multer.File): Promise<string> {
    try {
      const uploadStream = () =>
        new Promise<string>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: this.configService.get(
                'appConfig.cloudinaryUploadFolder',
              ),
            },
            (error, result) => {
              if (error) {
                return reject(error);
              }
              resolve(result.secure_url);
            },
          );
          streamifier.createReadStream(file.buffer).pipe(stream);
        });

      return await uploadStream();
    } catch (error) {
      console.error('RequestTimeoutException', error);
      throw new RequestTimeoutException('Failed to upload file to Cloudinary');
    }
  }
}
