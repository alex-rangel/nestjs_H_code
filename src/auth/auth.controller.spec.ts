import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '../guards/auth.guard';
import { fileServiceMock } from '../testing/file-service.mock';
import { guardMock } from '../testing/guard.mock';
import { AuthController } from './auth.controller';
import { authServiceMock } from '../testing/auth-service.mock';
import { AuthLoginDto } from './dto/auth-login.dto';
import { authLoginDTO } from '../testing/auth-login-dto.mock';
import { access } from 'fs';
import { accessToken } from '../testing/access-token.mock';
import { authForgetDTO } from '../testing/auth-forget-dto.mock';
import { authResetDTO } from '../testing/auth-reset-dto.mock';
import { userList } from '../testing/user-list-mock';
import { authRegisterDTO } from '../testing/auth-register-dto.mock';

describe('AuthController', () => {
    let authController: AuthController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [authServiceMock, fileServiceMock],
        })
            .overrideGuard(AuthGuard)
            .useValue(guardMock)
            .compile();

        authController = module.get<AuthController>(AuthController);
    });

    test('Validar a definição', () => {
        expect(authController).toBeDefined();
    });

    describe('Fluxo de autenticação', () => {
        test('login method', async () => {
            const result = await authController.login(authLoginDTO);
            expect(result).toEqual(accessToken);
        });

        test('register method', async () => {
            const result = await authController.register(authRegisterDTO);
            expect(result).toEqual(accessToken);
        });

        test('forget method', async () => {
            const result = await authController.forget(authForgetDTO);
            expect(result).toEqual({ success: true });
        });

        test('reset method', async () => {
            const result = await authController.reset(authResetDTO);
            expect(result).toEqual(accessToken);
        });
    });

    describe('Rotas autenticadas', () => {
        test('me method', async () => {
            const result = await authController.me(userList[0]);
            expect(result.user).toEqual(userList[0]);
        });

        test('uploadPhoto method', async () => {
          
            const photo = {
                fieldname: 'file',
                originalname: 'photo.png',
                encoding: '7bit',
                mimetype: 'image/png',
                size: 1024 * 50,
                destination: '',
                filename: 'file-name',
                path: 'file-path',
                buffer: Buffer.from('')
            } as Express.Multer.File

          const result = await authController.uploadPhoto(userList[0], photo);
          console.log(result);
          expect(result).toEqual({ sucess: true });
        });
    });
});