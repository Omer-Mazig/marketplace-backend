import { FileTypes } from '../enums/file-types.enum';

export interface IUploadFile {
  name: string;
  path: string;
  type: FileTypes;
  mime: string;
  size: number;
}
