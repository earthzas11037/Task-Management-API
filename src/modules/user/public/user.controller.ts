import { Controller, Inject } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from 'src/modules/user/domain/user.service';

@ApiTags('User')
@Controller('users')
@ApiBearerAuth('Authorization')
export class UserController {
  @Inject() private readonly UserService: UserService;
  constructor() {}
}
