import { Role } from '../enums/role.enum';
import { UpdateUserDto } from '../user/dto/update-user.dto';


export const updatePatchUserDTO: UpdateUserDto = {
  role: Role.Admin,
};