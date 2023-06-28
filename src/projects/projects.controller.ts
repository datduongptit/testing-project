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

@Controller('project')
export class ProjectController {
  constructor(private readonly projectsService: ProjectService) {}

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
    summary: 'create a project',
  })
  @ApiBearerAuth()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async update(@Body() createProjectDto: CreateProjecttDto) {
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
    console.log(body);

    return await this.projectsService.delete(id);
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
