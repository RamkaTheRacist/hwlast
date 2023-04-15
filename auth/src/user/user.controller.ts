import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from "./user.model";
import { BanDto } from "./dto/ban.dto";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";


@ApiTags('Users')
@Controller('users')
export class UserController{
    constructor(private usersService: UserService) { }

    @ApiOperation({ summary: 'Get all users' })
    @ApiResponse({ status: 200, type: [User] })
    @UseGuards(JwtAuthGuard)
    @Get()
    getAll() {
        return this.usersService.getAllUsers();
    }

    @ApiOperation({ summary: 'Ban users' })
    @ApiResponse({ status: 200, type: User })
    @UseGuards(JwtAuthGuard)
    @Post('/ban')
    ban(@Body() dto: BanDto) {
        return this.usersService.ban(dto);
    }
}