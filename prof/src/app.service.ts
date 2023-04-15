import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from "@nestjs/sequelize";
import { CreateUserDto } from './dto/create-user.dto';
import { Profile } from './profile.model';

@Injectable()
export class AppService {

  constructor(@Inject('TEST-SERVICE') private client: ClientProxy, @InjectModel(Profile) private profileRepository: typeof Profile) { }

  async createProfile(userDto: CreateUserDto) {
    return this.client.send('create-user', { ...userDto });
  }

  async continueToCreate(userDto: CreateUserDto) {
    const prof = await this.profileRepository.create({ ...userDto });
    return prof;
  }

  async getProfile(id: number) {
    const prof = await this.profileRepository.findOne({ where: { userId: id } })
    if (!prof) {
      throw new BadRequestException('Havent such profile');
    }
    return prof;
  }

  async changeProfile(userDto: CreateUserDto, id: number) {
    const prof = await this.profileRepository.findOne({ where: { userId: id } })
    if (!prof) {
      throw new BadRequestException('Havent such profile');
    }
    prof.firstName = userDto.firstName;
    prof.secondName = userDto.secondName;
    prof.phoneNumber = userDto.phoneNumber;
    return prof.save();
  }

  async deleteProfile(id: number) {
    const prof = await this.profileRepository.findOne({ where: { userId: id } })
    if (!prof) {
      throw new BadRequestException('Havent such profile');
    }
    await this.profileRepository.destroy({ where: { userId: id } });
    return prof;
  }

  async getAllProfiles() {
    const profiles = await this.profileRepository.findAll();
    return profiles;
  }
}
