import { NestFactory } from '@nestjs/core';
import { AppModule } from './App/app.module';
import { ValidationPipe } from '@nestjs/common';
import { LogInterceptor } from './interceptors/log.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(new ValidationPipe());

  //configuração para poder usar o interceptor de forma global
  //app.useGlobalInterceptors(new LogInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
