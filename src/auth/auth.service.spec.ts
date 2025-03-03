import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { prismaServiceMock } from "../testing/prisma-service.mock";
import { UserServiceMock } from "../testing/user-service.mock";
import { jwtServiceMock } from "../testing/jwt-service.mock";
import { mailerServiceMock } from "../testing/mailer-service.mock";
import { userList } from "../testing/user-list-mock";

describe('authService', () => {

    let authService: AuthService

    beforeEach(async () => {

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                prismaServiceMock,
                UserServiceMock,
                jwtServiceMock,
                mailerServiceMock

            ]
        }).compile()

        authService = module.get<AuthService>(AuthService)
    })

    test('validar a definição', () => {

        expect(authService).toBeDefined()
    })

    describe('Token', () => {
        test('createToken method', () => {

            const accessToken = { 'access_token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsIm5hbWUiOiJHbGF1Y2lvIERhbmllbCIsImVtYWlsIjoiZ2xhdWNpbzJAaGNvZGUuY29tLmJyIiwiaWF0IjoxNjcyMTE3NDI3LCJleHAiOjE2NzI3MjIyMjcsImF1ZCI6InVzZXJzIiwiaXNzIjoibG9naW4iLCJzdWIiOiIxNSJ9.eSHCxi2YwRvz4gSZ4Rs1geebvDu7_FRfeAZX9ErvTGY' };

            const result = authService.createToken(userList[0]);

            expect(result).toEqual(accessToken);
        });

        test('checkToken method', async () => {

            const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsIm5hbWUiOiJHbGF1Y2lvIERhbmllbCIsImVtYWlsIjoiZ2xhdWNpbzJAaGNvZGUuY29tLmJyIiwiaWF0IjoxNjcyMTE3NDI3LCJleHAiOjE2NzI3MjIyMjcsImF1ZCI6InVzZXJzIiwiaXNzIjoibG9naW4iLCJzdWIiOiIxNSJ9.eSHCxi2YwRvz4gSZ4Rs1geebvDu7_FRfeAZX9ErvTGY';

            const jwtPayload = {
                id: 1,
                name: 'Glaucio Daniel',
                email: 'glaucio@hcode.com.br',
                iat: 1672197163,
                exp: 1672801963,
                aud: 'users',
                iss: 'login',
                sub: '1',
            };

            const result = await authService.checkToken(accessToken);

            expect(result).toEqual(jwtPayload);
        });

        test('isValidToken method', () => {

            const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsIm5hbWUiOiJHbGF1Y2lvIERhbmllbCIsImVtYWlsIjoiZ2xhdWNpbzJAaGNvZGUuY29tLmJyIiwiaWF0IjoxNjcyMTE3NDI3LCJleHAiOjE2NzI3MjIyMjcsImF1ZCI6InVzZXJzIiwiaXNzIjoibG9naW4iLCJzdWIiOiIxNSJ9.eSHCxi2YwRvz4gSZ4Rs1geebvDu7_FRfeAZX9ErvTGY';

            const result = authService.isValidToken(accessToken);

            expect(result).toEqual(true);
        });
    });



});