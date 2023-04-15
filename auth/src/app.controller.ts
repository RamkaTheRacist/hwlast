import { Body, Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { Request, Response } from 'express';
import { Token } from './token/token.model';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { MessagePattern, Payload} from '@nestjs/microservices';
import { CreateUserDto } from './user/dto/create-user.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, type: Token })
  @Post('/login')
  async login(@Req() req: Request, @Res() res: Response) {
    try {
      const authDto = req.body;
      const userData = await this.appService.login(authDto);
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
      return res.json(userData);
    } catch (error) {
      return res.json(error.response)
    }
  }

  
  @MessagePattern('create-user')
  async createProfile(@Payload() userDto: CreateUserDto) {
    try {
      return await this.appService.registration(userDto);
    } catch (error) {
      return error.response;
    }
  }

  @ApiOperation({ summary: 'Logout' })
  @ApiResponse({ status: 200 })
  @UseGuards(JwtAuthGuard)
  @Post('/logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    try {
      const refreshToken = req.headers.cookie.split('=')[1];
      const token = await this.appService.logout(refreshToken);
      res.clearCookie('refreshToken');
      return res.json(token);
    } catch (error) {
      return res.json(error.response)
    }
  }

  @ApiOperation({ summary: 'Refresh tokens' })
  @ApiResponse({ status: 200, type: Token })
  @UseGuards(JwtAuthGuard)
  @Get('/refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    try {
      if (!req.headers.cookie) {
        throw new UnauthorizedException({ message: 'No auth' });
      }
      const refreshToken = req.headers.cookie.split('=')[1];
      const userData = await this.appService.refresh(refreshToken);
      res.cookie('refreshToken', userData.refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
      return res.json(userData);
    } catch (error) {
      return res.json(error.response)
    }
  }
}
