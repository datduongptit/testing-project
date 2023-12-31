import {
  Controller,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Req,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Roles } from './decorator/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { RolesGuard } from './guards/roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Login
  @ApiOperation({
    summary: 'Login as a user',
  })
  @UsePipes(ValidationPipe)
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Req() req: Request) {
    return await this.authService.login(req.user);
  }

  @UsePipes(ValidationPipe)
  @UseGuards(LocalAuthGuard)
  @Post('/logout')
  async logout(@Req() req: Request) {
    return await this.authService.login(req.user);
  }

  // @Status(AccountStatus.VERIFIED)
  // @UsePipes(ValidationPipe)
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('password/change')
  changePassword(@Req() req: Request) {
    return this.authService.changePassword(req.user, req.body);
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('password/reset')
  resetPassword(@Req() req: Request) {
    const email = req.body.email;
    return this.authService.resetPassword(email);
  }
}
