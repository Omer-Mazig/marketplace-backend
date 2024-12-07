import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Upload } from '../upload.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UploadToCloudinaryProvider } from './upload-to-cloudinary-provider.provider';
import { IUploadFile } from '../interfaces/upload-file.interface';
import { FileTypes } from '../enums/file-types.enum';

@Injectable()
export class UploadsService {
  constructor(
    @InjectRepository(Upload)
    private readonly uploadRepository: Repository<Upload>,
    private readonly uploadToCloudinaryProvider: UploadToCloudinaryProvider,
  ) {}

  public async uploadFile(file: Express.Multer.File) {
    if (
      !['image/gif', 'image/jpeg', 'image/jpg', 'image/png'].includes(
        file.mimetype,
      )
    ) {
      throw new BadRequestException('Mime type not supported');
    }

    try {
      const name = await this.uploadToCloudinaryProvider.fileUpload(file);

      const fileToUpload: IUploadFile = {
        name,
        path: name, // The secure URL is returned from Cloudinary
        type: FileTypes.IMAGE,
        mime: file.mimetype,
        size: file.size,
      };

      const upload = this.uploadRepository.create(fileToUpload);
      return await this.uploadRepository.save(upload);
    } catch (error) {
      console.error('ConflictException', error);
      throw new ConflictException(error);
    }
  }
}
