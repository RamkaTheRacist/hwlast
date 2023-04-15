import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from './pipe/validation.pipe';
import { Transport, RmqOptions } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT');
  app.useGlobalPipes(new ValidationPipe());
  app.connectMicroservice<RmqOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBIT_MQ_URI],
      queue: process.env.RABBIT_MQ_AUTH_QUEUE,  
      queueOptions: {
        durable: false
      }
    }
  });

  const config = new DocumentBuilder()
    .setTitle("RTR")
    .setDescription("Test Document")
    .setVersion("0.0.1")
    .addTag("RTR")
    .build()

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);
  app.startAllMicroservices();
  await app.listen(configService.get('PORT'), () => console.log(`AUTH IS WORKING ON ${PORT}`));

}
bootstrap();