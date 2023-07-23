import { FILE_TYPE } from 'src/enums/file.enum';

export class CreateFileDto {
  projectId: string;
  userUpload: string;
  fileName: string;
  fileType: FILE_TYPE;
}
