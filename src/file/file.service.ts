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
      file.baseUrl = url.baseUrl;
      file.fileType = createfileDto.fileType;
      file.fileName = createfileDto.fileName || url.originalName;
      file.projectId = createfileDto.projectId;
      file.userUpload = createfileDto.userUpload;
      return await this.fileRepository.save(file);
    } catch (err) {
      throw new Error(`Error creating ${err} product ${err.message}`);
    }
  }

  async delete(id: string) {
    try {
      return await this.fileRepository.delete({ id });
    } catch (err) {
      throw new Error(`Error creating ${err} product ${err.message}`);
    }
  }

  async getFileByProjectId(id: string) {
    try {
      return await this.fileRepository.find({
        where: { projectId: id },
        relations: {
          projectsId: true,
        },
      });
    } catch (err) {
      throw new Error(`Error creating ${err} product ${err.message}`);
    }
  }

  async uploadFile(file, id) {
    if (!file) throw new BadRequestException('File invalid');
    const s3 = new S3({
      accessKeyId: process.env.AMAZON_ACCESS_ID,
      secretAccessKey: process.env.AMAZON_SECRET_KEY,
    });
    const fileName = `${Date.now()}-${uid()}${extname(
      file.originalname,
    ).toLowerCase()}`;
    const originalName = file.originalname;
    const uploadResult = await s3
      .upload({
        Bucket: process.env.AMAZON_BUCKET_NAME,
        Body: file.buffer,
        Key: `${id}/${fileName}`,
        ContentType: file.mimetype,
        // ACL: 'public-read',
      })
      .promise();
    const { Location, Key } = uploadResult;
    const baseUrl = Location.replace(Key, '');
    const url = Key;

    return { baseUrl, url, originalName };
  }

  async deleteFileOnAwsS3(url: string) {
    const s3 = new S3({
      accessKeyId: process.env.AMAZON_ACCESS_ID,
      secretAccessKey: process.env.AMAZON_SECRET_KEY,
    });
    try {
      await s3
        .deleteObject({
          Bucket: process.env.AMAZON_BUCKET_NAME,
          Key: url,
        })
        .promise();
    } catch (err) {
      console.log(err);
    }
  }
}
