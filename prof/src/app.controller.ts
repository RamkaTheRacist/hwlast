import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Profile } from './profile.model';
import { EventPattern, Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserGuard } from './guards/user.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @ApiOperation({ summary: 'Registrate user and profile' })
  @ApiResponse({ status: 200, type: Profile })
  @Post('/registration')
  async createProfile(@Body() userDto: CreateUserDto) {
    return await this.appService.createProfile(userDto);
  }

  @EventPattern('continue-create')
  async continueToCreateProfile(@Payload() userDto: CreateUserDto) {
    return await this.appService.continueToCreate(userDto);
  }

  @ApiOperation({ summary: 'Get profile by id' })
  @ApiResponse({ status: 200, type: Profile })
  @UseGuards(JwtAuthGuard)
  @Get('/profile/:id')
  async getProfile(@Param('id') id: number) {
    return await this.appService.getProfile(id);
  }

  @ApiOperation({ summary: 'Get all profiles' })
  @ApiResponse({ status: 200, type: [Profile] })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllProfiles() {
    return await this.appService.getAllProfiles();
  }

  @ApiOperation({ summary: 'Delete profile' })
  @ApiResponse({ status: 200, type: Profile })
  @UseGuards(JwtAuthGuard, UserGuard)
  @Delete('/delete/:id')
  async deleteProfile(@Param('id') id: number) {
    return await this.appService.deleteProfile(id);
  }

  @ApiOperation({ summary: 'Update profile' })
  @ApiResponse({ status: 200, type: Profile })
  @UseGuards(JwtAuthGuard, UserGuard)
  @Put('/change/:id')
  async changeProfile(@Body() userDto: CreateUserDto, @Param('id') id: number) {
    return await this.appService.changeProfile(userDto, id);
  }
}
