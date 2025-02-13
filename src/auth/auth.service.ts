import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { AuthRegisterDto } from './dto/auth-register.dto';
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {

    private issuer = 'login';
    private audience = 'users';

    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService,
        private readonly userService: UserService,
        private readonly mailer: MailerService
    ) { }

    createToken(user: User) {
        return {
            access_token: this.jwtService.sign({
                id: user.id,
                name: user.name,
                email: user.email
            }, {
                expiresIn: '7d',
                subject: String(user.id),
                issuer: 'login',
                audience: 'users'
            }),
        }
    }

    checkToken(token: string) {

        try {
            const data = this.jwtService.verify(token, {
                issuer: 'login',
                audience: 'users'
            });

            return data;

        } catch (error) {
            throw new BadRequestException(error);

        }

    }

    isValidToken(token: string) {

        try {
            this.checkToken(token);
            return true;
        } catch (error) {
            return false;
        }
    }

    async login(email: string, password: string) {

        const user = await this.prisma.user.findFirst({
            where: {
                email
            }
        });

        if (!user) {
            throw new UnauthorizedException('Email ou senha inválidos');
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            throw new UnauthorizedException('Email ou senha inválidos');
        }

        return this.createToken(user);
    }

    async forget(email: string) {

        const user = await this.prisma.user.findFirst({
            where: {
                email
            }
        });

        if (!user) {
            throw new UnauthorizedException('Email inválido');
        }

        const token = this.jwtService.sign({
            id: user.id,
        }, {
            expiresIn: '1h',
            subject: String(user.id),
            issuer: 'forget',
            audience: 'users'
        });

        //TO DO: Enviar o e-mail...
        await this.mailer.sendMail({
            to: email,
            subject: 'Recuperação de senha',
            template: 'forget',
            context: {
                name: user.name,
                token: token
            }
        })

        return true
    }

    async reset(token: string, password: string) {

        //TO DO: Verificar se o token é válido

        try {
            const data: any = this.jwtService.verify(token, {
                issuer: 'forget',
                audience: 'users'
            });

            if (isNaN(Number(data.id))) {
                throw new BadRequestException('Token inválido');
            }

            const salt = await bcrypt.genSalt();
            password = await bcrypt.hash(password, salt);

            const user = await this.prisma.user.update({
                where: {
                    id: Number(data.id)
                },
                data: {
                    password
                }
            });

            return this.createToken(user);

        } catch (error) {
            throw new BadRequestException(error);

        }


    }

    async register(data: AuthRegisterDto) {

        const user = await this.userService.create(data);

        return this.createToken(user);
    }

}
