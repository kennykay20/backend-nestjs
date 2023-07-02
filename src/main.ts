import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as fileUpload from 'express-fileupload';
import { NestExpressApplication } from '@nestjs/platform-express';
import { config } from './config';
import { ValidationPipe } from '@nestjs/common';
import { AuthorizationService } from './authorization/auth.service';
import {
  SessionMiddleware,
  SelfTokenMiddleware,
} from './middlewares/tokenAuth.middleware';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const authService = app.get(AuthorizationService);
  const secret = await authService.getSecretKey();
  app.set('trust proxy', 1);
  app.use(SessionMiddleware(secret));
  // console.log('next called to cookieParser ');
  app.use(cookieParser(secret));
  // console.log('after cookieParser');
  // console.log(cookieParser);
  // console.log('next called to selftokenmiddleware ');
  app.use(SelfTokenMiddleware);
  // console.log('next call after selfTokenMiddleware ');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: false,
    }),
  );

  app.use(bodyParser.json());
  app.use(
    fileUpload({
      limits: { fileSize: 100 * 1024 * 1024 }, // 50 MB
      useTempFiles: true,
      tempFileDir: '/tmp/',
      abortOnLimit: true,
    }),
  );

  const corsOptions = {
    origin: '*',
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    optionsSuccessStatus: 200,
    credentials: true,
    exposedHeaders: ['set-cookie', 'Set-Cookie'],
  };

  app.enableCors(corsOptions);

  await app.listen(config.port);
  console.log(`APP started on port ${config.port}`);
}
bootstrap();
