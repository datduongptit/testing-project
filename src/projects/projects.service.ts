import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { S3 } from 'aws-sdk';
import { uid } from 'src/utils/functions';
import { extname } from 'path';
import { Projects } from './entity/projects.entity';
import { CreateProjecttDto } from './dto/projects.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Projects)
    private projectsRepository: Repository<Projects>,
  ) {}

  async findAll(): Promise<Projects[]> {
    return await this.projectsRepository.find();
  }

  async create(
    createProjectDto: CreateProjecttDto,
    id: string,
  ): Promise<Projects> {
    try {
      const project = new Projects();
      project.userId = id;
      project.name = createProjectDto.name;
      project.usersAssigned = createProjectDto.usersAssigned;
      project.manager = createProjectDto.manager;
      project.customer = createProjectDto.customer;
      return await this.projectsRepository.save(project);
    } catch (err) {
      throw new Error(`Error creating ${err} product ${err.message}`);
    }
  }

  async update(createProjectDto: CreateProjecttDto): Promise<Projects> {
    try {
      const projectUpdate = await this.projectsRepository.findOneBy({
        projectId: createProjectDto.projectId,
      });
      projectUpdate.name = createProjectDto.name;
      projectUpdate.usersAssigned = createProjectDto.usersAssigned;
      projectUpdate.manager = createProjectDto.manager;
      projectUpdate.customer = createProjectDto.customer;
      return await this.projectsRepository.save(projectUpdate);
    } catch (err) {
      throw new Error(`Error creating ${err} product ${err.message}`);
    }
  }

  async delete(id: string) {
    try {
      const deleted = await this.projectsRepository.delete({ projectId: id });
      return deleted;
    } catch (err) {
      throw new Error(`Error creating ${err} product ${err.message}`);
    }
  }

  async getProjectById(id: string) {
    try {
      const result = await this.projectsRepository.findOne({
        where: {
          projectId: id,
        },
      });
      return result;
    } catch (err) {
      throw new Error(`Error creating ${err} product ${err.message}`);
    }
  }

  async getProjectByUserId(id: string) {
    try {
      const result = await this.projectsRepository.find({
        where: [
          {
            userId: id,
          },
          {
            usersAssigned: Like(`%${id}%`),
          },
        ],
      });
      return result;
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
