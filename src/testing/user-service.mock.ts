import { UserService } from "../user/user.service";

export const UserServiceMock = {
    provide: UserService,
    useValue: {
            create:jest.fn(),
            list:jest.fn(),
            show:jest.fn(),
            updatePartial:jest.fn(),
            delete:jest.fn(),
    }
}