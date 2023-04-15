import { BadRequestException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { AuthDto } from './dto/auth.dto';
import { Token } from './token/token.model';
import { UserService } from './user/user.service';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './user/dto/create-user.dto';
import { User } from './user/user.model';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class AppService {
  constructor(private jwtService: JwtService, private userSerive: UserService, @InjectModel(Token) private tokenRepository: typeof Token,
    @Inject('TEST-SERVICE') private client: ClientProxy) { }

  async login(authDto: AuthDto) {
    const user = await this.userSerive.getUserByEmail(authDto.email);
    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    const isPasswordEquals = await bcrypt.compare(authDto.password, user.password);
    if (!isPasswordEquals) {
      throw new BadRequestException('Invalid password');
    }

    return await this.generateAndSaveTokenAndPayload(user);
  }
  async registration(userDto: CreateUserDto) {
    if (await this.userSerive.getUserByEmail(userDto.email)) {
      throw new BadRequestException('User with such email exists');
    }
    const hashPassword = await bcrypt.hash(userDto.password, 5);
    const user = await this.userSerive.createUser({ ...userDto, password: hashPassword });
    
    this.client.emit('continue-create', { userId:user.id, ...userDto });
    return await this.generateAndSaveTokenAndPayload(user);
  }

  async logout(refreshToken: string) {
    await this.tokenRepository.destroy({ where: { refreshToken } });
  }

  async refresh(refreshToken: string) {
    const userData = await this.validateRefreshToken(refreshToken);
    const tokenFromDB = this.tokenRepository.findOne({ where: { refreshToken } });
    if (!userData || !tokenFromDB) {
      throw new UnauthorizedException({ message: 'No auth' });
    }

    const user = await this.userSerive.getUserByEmail(userData.email);

    return await this.generateAndSaveTokenAndPayload(user);

  }

  private async generateToken(user: User) {
    const payload = { userId: user.id, email: user.email, banned: user.banned };
    const [accesToken, refreshToken] = await Promise.all([
      this.jwtService.sign({
        ...payload
      },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: '30s',
        }),
      this.jwtService.sign({
        ...payload
      },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '10d',
        }
      )
    ]);
    return {
      accesToken,
      refreshToken
    };


  }
  private async saveToken(userId: number, refreshToken: string) {
    const tokenData = await this.tokenRepository.findOne({ where: { userId } });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }
    const token = await this.tokenRepository.create({ userId, refreshToken })
    return token;
  }

  private async validateAccessToken(token: string) {
    try {
      const userData = await this.jwtService.verify(token, { secret: process.env.JWT_ACCESS_SECRET });
      return userData;
    } catch (error) {
      return null;
    }
  }
  private async validateRefreshToken(token: string) {
    try {
      const userData = await this.jwtService.verify(token, { secret: process.env.JWT_REFRESH_SECRET });
      return userData;
    } catch (error) {
      return null;
    }
  }

  private async generateAndSaveTokenAndPayload(user: User) {
    const tokens = await this.generateToken(user);
    await this.saveToken(user.id, tokens.refreshToken);
    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        banned: user.banned
      }
    };
  }

}
