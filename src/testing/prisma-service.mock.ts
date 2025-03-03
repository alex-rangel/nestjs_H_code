import { PrismaService } from "../prisma/prisma.service";
import { userList } from "./user-list-mock";

export const prismaServiceMock = {
                    provide: PrismaService,
                    useValue: {
                        user: {
                            create: jest.fn(),
                            findMany: jest.fn().mockResolvedValue(userList),
                            findUnique: jest.fn().mockResolvedValue(userList[0]),
                            update: jest.fn(),
                            delete: jest.fn()
                        }
                    }
                }