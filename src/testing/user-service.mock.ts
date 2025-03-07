import { UserService } from "../user/user.service";
import { userList } from "./user-list-mock";

export const UserServiceMock = {
    provide: UserService,
    useValue: {
            create:jest.fn().mockResolvedValue(userList[0]),
            list:jest.fn().mockResolvedValue(userList),
            show:jest.fn().mockResolvedValue(userList[0]),
            updatePartial:jest.fn(),
            delete:jest.fn(),
    }
}