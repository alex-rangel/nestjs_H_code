import { Role } from "../enums/role.enum";

export const userList = [
    {
      name: 'Alex Rangel',
      email: 'alex@email.com.br',
      birthAt: new Date('2000-01-01'),
      id: 1,
      password: '$2b$10$KTCMumuAvsZcxgEXCA4.x.sqeqtrWXmB7ptFGkF.f32XW3OE3Awb6',
      role: Role.Admin,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Glaucio Daniel',
      email: 'glaucio@hcode.com.br',
      birthAt: new Date('2000-01-01'),
      id: 2,
      password: '$2b$10$KTCMumuAvsZcxgEXCA4.x.sqeqtrWXmB7ptFGkF.f32XW3OE3Awb6',
      role: Role.Admin,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      name: 'Djalma Sindaux',
      email: 'djalma@hcode.com.br',
      birthAt: new Date('2000-01-01'),
      id: 3,
      password: '$2b$10$KTCMumuAvsZcxgEXCA4.x.sqeqtrWXmB7ptFGkF.f32XW3OE3Awb6',
      role: Role.Admin,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];