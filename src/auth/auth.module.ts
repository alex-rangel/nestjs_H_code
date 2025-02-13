import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule} from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { FileModule } from 'src/file/file.module';

@Module({
  imports: [JwtModule.register({
    secret: 'a08372b70196c21a9229cf04db6b7ceb'
  }),
  PrismaModule,
  forwardRef(() => UserModule),
  PrismaModule,
  FileModule
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule { }
