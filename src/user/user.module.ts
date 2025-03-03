import { Module, NestModule, MiddlewareConsumer, RequestMethod, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { UseIdCheckMiddleware } from '../middleware/use-id-check.middleware';

@Module({
  imports: [PrismaModule, forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UseIdCheckMiddleware).forRoutes({
      path: 'user/:id',
      method: RequestMethod.ALL,
    });
  }
}
