import { JwtAuthGuard } from './../auth/guards/jwt-auth.guard';
import {
  Controller,
  Get,
  UseGuards,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  ParseFilePipeBuilder,
  Param,
  Query,
} from '@nestjs/common';

import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { Roles } from '../auth/decorator/roles.decorator';
import { Role } from '../enums/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProjectService } from './projects.service';
import { Projects } from './entity/projects.entity';
import { CreateProjecttDto } from './dto/projects.dto';
import { User } from 'src/users/entity/users.entity';
import { CurrentUser } from 'src/auth/decorator/user.decorator';
import { UsersService } from 'src/users/users.service';
import { FileService } from 'src/file/file.service';

@Controller('project')
export class ProjectController {
  constructor(
    private readonly projectsService: ProjectService,
    private readonly userService: UsersService,
    private readonly fileService: FileService,
  ) {}

  @Get('/all')
  @ApiOperation({
    summary: 'Find all project',
  })
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findAll(): Promise<Projects[]> {
    return await this.projectsService.findAll();
  }

  @Post('/create')
  @ApiOperation({
    summary: 'create a project',
  })
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async create(
    @Body() createProjectDto: CreateProjecttDto,
    @CurrentUser() user: User,
  ) {
    const id = user.id;
    return await this.projectsService.create(createProjectDto, id);
  }

  @Post('/update')
  @ApiOperation({
    summary: 'update a project',
  })
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async update(@Body() createProjectDto: CreateProjecttDto) {
    console.log(1222);

    return await this.projectsService.update(createProjectDto);
  }

  @Post('/delete')
  @ApiOperation({
    summary: 'delete a project',
  })
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async delete(@Body() body: any) {
    const id = body.projectId;
    return await this.projectsService.delete(id);
  }

  @Get('/user/:id')
  @ApiOperation({
    summary: 'get a project',
  })
  @ApiBearerAuth()
  // @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  async getProjectById(@Query() query: any, @Param('id') id: string) {
    const { result, total } = await this.projectsService.search(id, query);
    const listUsersAssigned = await Promise.all(
      result.map(async (project) => {
        const listUsers = await JSON.parse(project.usersAssigned);
        const result = await this.userService.getUserByListIds(listUsers);
        const usersAssigned = result.map((result) => ({
          name: result.username,
          id: result.id,
          role: result.role,
        }));
        return { ...project, usersAssigned };
      }),
    );

    return { listUsersAssigned, total };
  }

  @Get('/:id')
  @ApiOperation({
    summary: 'get a project',
  })
  @ApiBearerAuth()
  // @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  async getProjectByProjectId(@Param('id') id: string) {
    const listProjects = await this.projectsService.getProjectById(id);
    const listUsers = JSON.parse(listProjects.usersAssigned);
    const result = await this.userService.getUserByListIds(listUsers);
    listProjects.usersAssigned = JSON.stringify(result);

    return listProjects;
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('file')
  async ploadFile(
    @Body() body: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const fileUpload = await this.projectsService.uploadFile(file, 'abc123');
    console.log(fileUpload);

    return {
      body,
      file: file.filename,
    };
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('file/pass-validation')
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
  @Post('file/fail-validation')
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
