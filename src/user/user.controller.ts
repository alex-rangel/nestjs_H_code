import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { UpdatePutUserDto } from './dto/update-put-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LogInterceptor } from 'src/interceptors/log.interceptor';
import { ParamId } from 'src/decorators/param-id.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enums/role.enum';
import { RoleGuard } from 'src/guards/role.guard';
import { AuthGuard } from 'src/guards/auth.guard';
import { ThrottlerGuard } from '@nestjs/throttler';

// usando um guard do throttle de forma local
@UseGuards(ThrottlerGuard)
@UseGuards(AuthGuard, RoleGuard)
@Controller('user')
export class UserController {

  constructor(private readonly userService: UserService) {}

  @Roles(Role.Admin)
  @Post()
  async create(@Body() body: CreateUserDto) {
    return  await this.userService.create(body);
  }
  // usando o interceptor de forma local
  //@UseInterceptors(LogInterceptor)
  
  @Roles(Role.Admin, Role.User)
  @Get()
  async findAll() {
    return await this.userService.list();
  }

  //@Roles(Role.Admin)
  @Get(':id')
  async findOne(@ParamId() id: number) {
    console.log(id);
    return this.userService.show(id);
  }

  @Roles(Role.Admin)
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: UpdatePutUserDto) {
    return await this.userService.update(id, body);
  }

  @Roles(Role.Admin)
  @Patch(':id')
  async updatePartial(@Param('id', ParseIntPipe) id: number, @Body() body: UpdateUserDto) {
    return await this.userService.updatePartial(id, body);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.delete(id);
  }
}
