import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Transport, RmqOptions } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from './pipe/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const PORT = configService.get('PORT');
  app.useGlobalPipes(new ValidationPipe());
  app.connectMicroservice<RmqOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBIT_MQ_URI],
      queue: process.env.RABBIT_MQ_PROF_QUEUE,
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
  await app.listen(configService.get('PORT'), () => console.log(`PROF IS WORKING ON ${PORT}`));
}
bootstrap();
