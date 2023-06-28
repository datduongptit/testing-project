import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { S3 } from 'aws-sdk';
import { uid } from 'src/utils/functions';
import { extname } from 'path';
import { File } from './entity/file.entity';
import { CreateFileDto } from './dto/file.dto';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File)
    private fileRepository: Repository<File>,
  ) {}

  async findAll(): Promise<File[]> {
    return await this.fileRepository.find();
  }

  async create(createfileDto: CreateFileDto, url: any): Promise<File> {
    try {
      const file = new File();
      file.url = url.url;
      file.projectId = createfileDto.projectId;
      file.userUpload = createfileDto.userUpload;
      return await this.fileRepository.save(file);
    } catch (err) {
      throw new Error(`Error creating ${err} product ${err.message}`);
    }
  }

  async delete(id: any) {
    try {
      await this.fileRepository.delete({ id: id });
    } catch (err) {
      throw new Error(`Error creating ${err} product ${err.message}`);
    }
  }

  async uploadFile(file, id) {
    if (!file) throw new BadRequestException('File invalid');
    const s3 = new S3({
      accessKeyId: 'AKIAQBFYOGILHSWNN67O',
      secretAccessKey: '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',
    });
    const fileName = `${Date.now()}-${uid()}${extname(
      file.originalname,
    ).toLowerCase()}`;
    const uploadResult = await s3
      .upload({
        Bucket: 'zeroes98',
        Body: file.buffer,
        Key: `${id}/${fileName}`,
        ContentType: file.mimetype,
        // ACL: 'public-read',
      })
      .promise();
    const { Location, Key } = uploadResult;
    const baseUrl = Location.replace(Key, '');
    const url = Key;
    return { baseUrl, url };
  }
}
