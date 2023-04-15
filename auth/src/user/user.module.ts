import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SequelizeModule } from "@nestjs/sequelize";
import { User } from './user.model';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports: [
    SequelizeModule.forFeature([User]),
    JwtModule.register({}),
  ],
  exports:[
    UserService
  ]
})
export class UserModule {}
