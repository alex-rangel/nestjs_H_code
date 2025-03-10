import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/App/app.module';
import * as dotenv from 'dotenv';
import { PrismaService } from '../src/prisma/prisma.service';
import { PrismaModule } from '../src/prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { execSync } from 'node:child_process';
import { authRegisterDTO } from '../src/testing/auth-register-dto.mock';
import { Role } from '../src/enums/role.enum';

dotenv.config({ path: '.env.test' });

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let prismaService: PrismaService;
  let AccessToken;

  beforeAll(async () => {
    execSync('npx prisma migrate deploy');
  });

  beforeEach(async () => {

    execSync('cross-env DATABASE_URL=mysql://alex:1234@localhost:3306/h_code_teste npx prisma migrate deploy')

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: process.env.NODE_ENV ?
            `.env.${process.env.NODE_ENV}` : '.env'
        }),
        AppModule,
        PrismaModule
      ],
    }).compile();

    prismaService = moduleFixture.get<PrismaService>(PrismaService);

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await prismaService.user.deleteMany();
  }
  );

  afterEach(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('Registrar um novo usuário', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(authRegisterDTO);

    expect(response.statusCode).toEqual(201);
    expect(typeof response.body.access_token).toEqual('string');
  });

  it('Tentar fazer login com o novo usuário', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: authRegisterDTO.email,
        password: authRegisterDTO.password,
      });

    expect(response.statusCode).toEqual(201);
    expect(typeof response.body.access_token).toEqual('string');

    AccessToken = response.body.access_token;

  });

  it('Obter os dados do usuário logado', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/me')
      .set('Authorization', `bearer ${AccessToken}`)
      .send();

    expect(response.statusCode).toEqual(201);
    expect(typeof response.body.user.id).toEqual('number');
    expect(response.body.user.role).toEqual(Role.User);
  });

  it('Registrar um novo usuário como administrador', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        ...authRegisterDTO,
        role: Role.Admin,
        email: 'henrique@hcode.com.br',
      });

    expect(response.statusCode).toEqual(201);
    expect(typeof response.body.access_token).toEqual('string');

    AccessToken = response.body.accessToken;
  });

  // it('Validar de a função do novo usuário ainda é User', async () => {
  //   const response = await request(app.getHttpServer())
  //     .post('/auth/me')
  //     .set('Authorization', `bearer ${AccessToken}`)
  //     .send();

  //     //console.log(response);

  //   expect(response.statusCode).toEqual(201);
  //   // expect(typeof response.body.user.id).toEqual('number');
  //   // expect(response.body.user.role).toEqual(Role.Admin);

  //   // userId = response.body.user.id;
  // });
});
