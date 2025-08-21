import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors({
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
  });
  app.use(cookieParser());
  app.useGlobalPipes(
      new ValidationPipe({
          whitelist: true, 
          transform: true,
      }),
  );
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
