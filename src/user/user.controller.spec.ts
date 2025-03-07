import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '../guards/auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserServiceMock } from '../testing/user-service.mock';
import { guardMock } from '../testing/guard.mock';
import { createUserDto } from '../testing/createUserDto.mock';
import { userList } from '../testing/user-list-mock';
import { updatePatchUserDTO } from '../testing/update-patch-user-dto.mock';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../enums/role.enum';

describe('UserController', () => {

    let userController: UserController;
    let userService: UserService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [UserServiceMock],
        })
            .overrideGuard(AuthGuard)
            .useValue(guardMock)
            .overrideGuard(RoleGuard)
            .useValue(guardMock)
            .compile();

        userController = module.get<UserController>(UserController);
        userService = module.get<UserService>(UserService);
    })

    test('Validar a definição', () => {
        expect(userController).toBeDefined();
    });

    // Teste da aplicação dos Guards neste controle, para vevificar se os guards estão aplicados de forma correta
    describe('Teste da aplicação dos Guards neste controle', () => {
        test('Se os guards estão aplicados', () => {
            const guards = Reflect.getMetadata('__guards__', UserController);

            expect(guards.length).toEqual(2);
            expect(new guards[0]()).toBeInstanceOf(AuthGuard);
            expect(new guards[1]()).toBeInstanceOf(RoleGuard);
        });
    });

    describe('Create', () => {
        test('create method', async () => {
            const result = await userController.create(createUserDto);
            expect(result).toEqual(userList[0]);
        });
    });

    describe('Read', () => {
        test('list method', async () => {

            const result = await userController.findAll();

            expect(result).toEqual(userList);
        });

        test('show method', async () => {
            const result = await userController.findOne(1);

            expect(result).toEqual(userList[0]);
        });
    });

    describe('Update', () => {
        test('updatePartial method', async () => {


            const updateUserDto: UpdateUserDto = { name: 'Novo nome' };

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

            jest.spyOn(userService, 'updatePartial').mockResolvedValue(updateUser)

            const result = await userController.updatePartial(1, updatePatchUserDTO);

            expect(result).toEqual(updateUser);
        });
    });

    describe('Delete', () => {
        test('delete method', async () => {
            jest.spyOn(userService, 'delete').mockResolvedValue({ success: true });

            const result = await userController.remove(1);

            expect(result).toEqual({ success: true });
        });
    });
});