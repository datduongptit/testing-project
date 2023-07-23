import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  UsePipes,
  ValidationPipe,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CurrentUser } from 'src/auth/decorator/user.decorator';
import { User } from './entity/users.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseMessage } from 'src/auth/decorator/response_message.decorator';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  @ApiOperation({
    summary: 'Sign Up as a user',
  })
  @UsePipes(ValidationPipe)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@CurrentUser() user: User) {
    return this.usersService.findUserById(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/delete')
  deleteAccount(@CurrentUser() user: User) {
    return this.usersService.findUserById(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/user-info/:id')
  getUserProfile(@Param('id') id: string) {
    return this.usersService.getUserById(id);
  }

  // @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('/listUsers')
  @ResponseMessage('Fetched Stats Succesfully')
  getAllProfile(@Query() query: any) {
    return this.usersService.search(query);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/update')
  updateUser(@CurrentUser('id') id: string, @Body() updateData: UpdateUserDto) {
    return this.usersService.update(id, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getUserById(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.usersService.getUserById(id);
  }
}
