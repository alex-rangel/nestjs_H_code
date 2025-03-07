import { Role } from "../enums/role.enum";
import { CreateUserDto } from "../user/dto/create-user.dto";

export const createUserDto: CreateUserDto = {
                birthAt: '2000-01-01',
                email: 'alex@email.com',
                name: 'Alex Rangel',
                password: '123456',
                role: Role.Admin
            }