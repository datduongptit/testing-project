import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  Get,
  Param,
  Delete,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import {
  CreateFileDto,
  UpdateFileDto,
  UpdateFunctionDto,
} from './dto/file.dto';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @UseInterceptors(FileInterceptor('file'))
  @Post('/upload')
  async uploadFile(
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
    @Body() createfileDto: CreateFileDto,
  ) {
    const fileUpload = await this.fileService.uploadFile(file, 'abc123');
    const uploaded = await this.fileService.create(createfileDto, fileUpload);
    return uploaded;
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('/update')
  async updateFile(
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateFileDto: UpdateFileDto,
  ) {
    const fileUpload = await this.fileService.uploadFile(file, 'abc123');
    const uploaded = await this.fileService.update(updateFileDto, fileUpload);
    return uploaded;
  }

  @Post('/update/function')
  async updateFunctions(@Body() updateFunctionDto: UpdateFunctionDto) {
    const update = await this.fileService.updateFunction(updateFunctionDto);
    return update;
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('/delete')
  async deleteFile(@Body() file: any) {
    return this.fileService.delete(file.id);
  }

  @UseInterceptors(FileInterceptor('file'))
  @Delete('/delete/:id')
  async deleteFileById(@Param('id') id: string, @Body() body: any) {
    const url = body.url;
    await this.fileService.deleteFileOnAwsS3(url);
    return await this.fileService.delete(id);
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('upload/pass-validation')
  uploadFileAndPassValidation(
    @Body() body: any,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'json',
        })
        .build({
          fileIsRequired: false,
        }),
    )
    file?: Express.Multer.File,
  ) {
    return {
      body,
      file: file?.buffer.toString(),
    };
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('upload/fail-validation')
  uploadFileAndFailValidation(
    @Body() body: any,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'jpg',
        })
        .build(),
    )
    file: Express.Multer.File,
  ) {
    return {
      body,
      file: file.buffer.toString(),
    };
  }
}
