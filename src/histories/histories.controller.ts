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
import { HistoriesService } from './histories.service';
import { Histories } from './entity/histories.entity';
import { CurrentUser } from 'src/auth/decorator/user.decorator';
import { User } from 'src/users/entity/users.entity';
import { CreateHistoriesDto } from './dto/log-histories.dto';

@Controller('histories')
export class HistoriesController {
  constructor(private readonly historiesService: HistoriesService) {}

  @Get('/all')
  @ApiOperation({
    summary: 'Find all project',
  })
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async findAll() {
    return await this.historiesService.findAll();
  }

  @ApiOperation({
    summary: 'Log action',
  })
  @Post('/logs')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async logAction(
    @Body() createHistoriesDto: CreateHistoriesDto,
    @CurrentUser() user: User,
  ) {
    const userId = user?.id;

    return await this.historiesService.logAction(userId, createHistoriesDto);
  }

  @ApiOperation({
    summary: 'Search action',
  })
  @Get('/search')
  @UseGuards(JwtAuthGuard, RolesGuard)
  async searchLog(@Query() query: any, @CurrentUser() user: User) {
    const userId = user?.id;
    return await this.historiesService.search(userId, query);
  }
}
