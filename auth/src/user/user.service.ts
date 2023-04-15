import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { BanDto } from './dto/ban.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.model';

@Injectable()
export class UserService {

    constructor(@InjectModel(User) private userRepository: typeof User) { }

    async getAllUsers() {
        const users = await this.userRepository.findAll();
        return users;
    }

    async getUserByEmail(email: string) {
        const user = await this.userRepository.findOne({ where: { email }, include: { all: true } });
        return user;
    }

    async createUser(dto: CreateUserDto) {
        const user = await this.userRepository.create(dto);
        return user;
    }

    async ban(dto: BanDto) {
        const user = await this.userRepository.findByPk(dto.userId);
        if (!user) {
            throw new HttpException('User doesnt exist', HttpStatus.NOT_FOUND);
        }
        user.banned = dto.ban;
        user.banReason = dto.banReason;
        await user.save();
        return user;
    }
}
