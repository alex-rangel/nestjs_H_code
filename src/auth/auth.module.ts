import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule} from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { UserModule } from '../user/user.module';
import { FileModule } from '../file/file.module';

@Module({
  imports: [JwtModule.register({
    secret: 'a08372b70196c21a9229cf04db6b7ceb'
  }),
  PrismaModule,
  forwardRef(() => UserModule),
  FileModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule { }
