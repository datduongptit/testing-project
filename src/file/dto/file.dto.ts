import { IsNotEmpty } from 'class-validator';

export class CreateFileDto {
  projectId: string;
  userUpload: string;
}
