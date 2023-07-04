import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { UserModule } from './users/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './config';
import { join } from 'path';
import { AuthorizationModule } from './authorization/auth.module';
import { ProfileModule } from './Profile/profile.module';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { PublicMiddleware } from './middlewares/public.middleware';

@Module({
  imports: [
    CatsModule,
    UserModule,
    AuthorizationModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: config.db.host,
      port: +config.db.port,
      username: config.db.username,
      password: config.db.password,
      database: config.db.databaseName,
      entities: [join(__dirname, '**', '*.model.{js,ts}')],
      logging: true,
      synchronize: true,
    }),
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: '/auth/login', method: RequestMethod.POST },
        { path: '/auth/registeruser', method: RequestMethod.POST },
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL });

    consumer
      .apply(PublicMiddleware)
      .forRoutes({ path: '/profile', method: RequestMethod.GET });
  }
}
