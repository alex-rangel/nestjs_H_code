import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdatePutUserDto } from './dto/update-put-user.dto';
import * as bcrypt from 'bcrypt'

@Injectable()
export class UserService {

  constructor(private prisma: PrismaService) { }

  async create({ name, email, password, role }: CreateUserDto) {

    const salt = await bcrypt.genSalt();

    password = await bcrypt.hash(password, salt);

    return await this.prisma.user.create({
      data: {
        name,
        email,
        password,
        role
      }
    });
  }

  async list() {
    return await this.prisma.user.findMany();
  }

  async show(id: number) {
    return await this.prisma.user.findUnique({
      where: {
        id
      }
    });
  }

  async update(id: number, { email, name, password, birthAt, role }: UpdatePutUserDto) {

    if (!(await this.show(id))) {
      throw new NotFoundException(`O usuário ${id} não existe.`);
    }

    const salt = await bcrypt.genSalt();

    password = await bcrypt.hash(password, salt);

    return this.prisma.user.update({
      data: { email, name, password, birthAt: birthAt ? new Date(birthAt) : null, role },
      where: {
        id
      }
    });
  }

  async updatePartial(id: number, { name, email, password, birthAt, role }: UpdateUserDto) {

    if (!(await this.show(id))) {
      throw new NotFoundException(`O usuário ${id} não existe.`);
    }

    const data: any = {};

    if (birthAt) {
      data.birthAt = new Date(birthAt);
    }

    if (name) {
      data.name = name;
    }

    if (email) {
      data.email = email;
    }

    if (password) {
      data.password = password;
    }

    if (role) {
      data.role = role;
    }

    return this.prisma.user.update({
      data,
      where: {
        id
      }
    });
  }

  async delete(id: number) {

    if (!(await this.show(id))) {
      throw new NotFoundException(`O usuário ${id} não existe.`);
    }

    try {
      await this.prisma.user.delete({
        where: {
          id
        }
      });

      return { success: true };

    } catch (error) {
      throw new Error(`Erro ao deletar o usuário ${id}`);
    };


  }
}
