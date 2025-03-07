import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { Role } from "../enums/role.enum";
import { userList } from "../testing/user-list-mock";
import { UpdatePutUserDto } from "./dto/update-put-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { prismaServiceMock } from "../testing/prisma-service.mock";
import { createUserDto } from "../testing/createUserDto.mock";


// o describe é um agrupador de testes, ele serve para agrupar testes que tem um mesmo objetivo
describe('UserService', () => {

    // declaração de uma variável que vai receber a instância do serviço que será testado   
    let userService: UserService;
    let prismaService: PrismaService;

    // o beforeEach é um método que é executado antes de cada teste
    beforeEach(async () => {

        // o método createTestingModule cria uma instância do módulo de testes, ou seja ele cria um módulo de testes para isso basta importar o TestingModule do pacote @nestjs/testing e o método Test do mesmo pacote
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                prismaServiceMock
            ]
        }).compile();

        // o método get serve para pegar uma instância de um serviço, para isso basta passar o serviço como argumento, no caso o UserService. Isso  é como se tivessemos injetando o serviço no teste
        userService = module.get<UserService>(UserService);
        prismaService = module.get<PrismaService>(PrismaService);

    });

    test('validar a difinição', () => {

        // o método toBeDefined verifica se a variável passada como argumento é definida, ou seja se ela não é undefined
        expect(userService).toBeDefined();
    })

    describe('Create', () => {

        test('method create', async () => {

            jest.spyOn(prismaService.user, 'create').mockResolvedValue(userList[0]);

            const result = await userService.create(createUserDto);

            expect(result).toEqual(userList[0]);
        });

    });
    describe('Read', () => {

        test('method list', async () => {

            const result = await userService.list();

            expect(result).toEqual(userList);
        });

        test('method show', async () => {

            const result = await userService.show(1);

            expect(result).toEqual(userList[0]);
        });
    });

    describe('Update', () => {

        test('method updatePartial', async () => {


            const updateUserDto: UpdateUserDto = { name: 'Novo nome'};

            const updateUser = {
                id: 1,
                name: 'Novo nome',
                email: 'joao@hcode.com.br',
                password: '$2b$10$KTCMumuAvsZcxgEXCA4.x.sqeqtrWXmB7ptFGkF.f32XW3OE3Awb6',
                birthAt: new Date('2000-01-01'),
                role: Role.Admin,
                createdAt: new Date(),
                updatedAt: new Date()
            }

            // A simulação do retorno tem que vim sempre antes da chamada do metodo
            jest.spyOn(prismaService.user, 'update').mockResolvedValue(updateUser)

            const result = await userService.updatePartial(1, updateUserDto);

            expect(result).toEqual(updateUser);
        });

    });
    describe('Delete', () => {

        test('method delete', async () => {
            const result = await userService.delete(1);

            expect(result).toEqual({ success: true });
        });
    });









});