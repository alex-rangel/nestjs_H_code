import { JwtService } from '@nestjs/jwt';


export const jwtServiceMock = {
  provide: JwtService,
  useValue: {
    
    sign: jest.fn().mockReturnValue('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsIm5hbWUiOiJHbGF1Y2lvIERhbmllbCIsImVtYWlsIjoiZ2xhdWNpbzJAaGNvZGUuY29tLmJyIiwiaWF0IjoxNjcyMTE3NDI3LCJleHAiOjE2NzI3MjIyMjcsImF1ZCI6InVzZXJzIiwiaXNzIjoibG9naW4iLCJzdWIiOiIxNSJ9.eSHCxi2YwRvz4gSZ4Rs1geebvDu7_FRfeAZX9ErvTGY'),

    verify: jest.fn().mockResolvedValue({
      id: 1,
      name: 'Glaucio Daniel',
      email: 'glaucio@hcode.com.br',
      iat: 1672197163,
      exp: 1672801963,
      aud: 'users',
      iss: 'login',
      sub: '1',
  })
  },
};