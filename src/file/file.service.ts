import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { S3 } from 'aws-sdk';
import { uid } from 'src/utils/functions';
import { extname } from 'path';
import { File } from './entity/file.entity';
import {
  CreateFileDto,
  UpdateFileDto,
  UpdateFunctionDto,
} from './dto/file.dto';
import { FILE_TYPE } from 'src/enums/file.enum';

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

  async update(updateFileDto: UpdateFileDto, url: any): Promise<File> {
    try {
      const fileUpdate = await this.fileRepository.findOneBy({
        id: updateFileDto.id,
      });
      fileUpdate.url = url.url;
      fileUpdate.baseUrl = url.baseUrl;
      fileUpdate.fileType = updateFileDto.fileType;
      fileUpdate.fileName = updateFileDto.fileName || url.originalName;
      fileUpdate.projectId = updateFileDto.projectId;
      fileUpdate.userUpload = updateFileDto.userUpload;
      return await this.fileRepository.save(fileUpdate);
    } catch (err) {
      throw new Error(`Error update ${err} file ${err.message}`);
    }
  }

  async updateFunction(updateFunctionDto: UpdateFunctionDto): Promise<File> {
    try {
      const fileUpdate = await this.fileRepository.findOneBy({
        id: updateFunctionDto.id,
      });
      fileUpdate.functions = updateFunctionDto.functions;

      return await this.fileRepository.save(fileUpdate);
    } catch (err) {
      throw new Error(`Error update ${err} file ${err.message}`);
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

  async getFileById(id: string) {
    try {
      return await this.fileRepository.findOne({
        where: { id },
      });
    } catch (err) {
      throw new Error(`Error creating ${err} product ${err.message}`);
    }
  }

  async getTotalBug() {
    try {
      const files = await this.fileRepository.find({
        where: {
          fileType: FILE_TYPE.TEST_CASE,
        },
        relations: {
          projectsId: true,
        },
      });
      let totalBugsSum = 0;
      let totalTestcase = 0;

      files.forEach((file) => {
        if (file.functions) {
          const functionsData = JSON.parse(file.functions);
          functionsData.forEach((func) => {
            totalBugsSum += parseInt(func.totalBug) || 0;
            totalTestcase += parseInt(func.testcase) || 0;
          });
        }
      });
      return { totalBugs: totalBugsSum, totalTestcase, files };
    } catch (err) {
      throw new Error(`Error creating ${err} product ${err.message}`);
    }
  }

  async uploadFile(file, id: string) {
    if (!file) throw new BadRequestException('File invalid');
    // const s3 = new S3({
    //   accessKeyId: process.env.AMAZON_ACCESS_ID,
    //   secretAccessKey: process.env.AMAZON_SECRET_KEY,
    // });
    const s3 = new S3({
      accessKeyId: 'AKIAQBFYOGILHSWNN67O',
      secretAccessKey: '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',
    });
    const fileName = `${Date.now()}-${uid()}${extname(
      file.originalname,
    ).toLowerCase()}`;
    const originalName = file.originalname;
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
