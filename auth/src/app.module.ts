import { Module } from '@nestjs/common';
import { ConfigModule} from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { SequelizeModule } from '@nestjs/sequelize';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Token } from './token/token.model';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    SequelizeModule.forFeature([Token]),
    UserModule,
    JwtModule.register({}),
    ConfigModule.forRoot({
      envFilePath: '.env'
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [],
      autoLoadModels: true
    }),
    ClientsModule.register([{
      name: 'TEST-SERVICE',
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBIT_MQ_URI],
        queue: process.env.RABBIT_MQ_PROF_QUEUE,  
        queueOptions: {
          durable: false
        }
      }
    }])

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }