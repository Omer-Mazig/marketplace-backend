import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './providers/uploads.service';
import { UploadToCloudinaryProvider } from './providers/upload-to-cloudinary-provider.provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Upload } from './upload.entity';

@Module({
  controllers: [UploadsController],
  providers: [UploadsService, UploadToCloudinaryProvider],
  imports: [TypeOrmModule.forFeature([Upload])],
})
export class UploadsModule {}
