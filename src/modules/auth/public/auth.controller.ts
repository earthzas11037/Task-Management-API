import { Body, Controller, HttpCode, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { RESPONSE_MESSAGES } from 'src/common/constants/response-messages.constants';
import { getUserContext } from 'src/common/utilities/request-context.utility';
import { AuthService } from 'src/modules/auth/domain/auth.service';
import { LoginWithEmailDto } from 'src/modules/auth/domain/dto/login-with-email.dto';
import { SignUpRequestDTO } from 'src/modules/auth/domain/dto/signup-request.dto';
import { UserAccessTokenService } from 'src/modules/auth/domain/user-access-token.service';
import { UserService } from 'src/modules/user/domain/user.service';

@ApiTags('Authentication')
@ApiBearerAuth('Authorization')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly service: AuthService,
    private readonly UserService: UserService,
    private readonly UserAccessTokenService: UserAccessTokenService,
  ) {}

  @Post('login')
  @ApiBody({ type: LoginWithEmailDto })
  @HttpCode(200)
  public async login(@Body() dto: LoginWithEmailDto) {
    const accessToken = await this.service.login(dto);
    return {
      ...RESPONSE_MESSAGES.SUCCESS,
      data: { accessToken: accessToken },
    };
  }

  @Post('logout')
  public async logout(@Req() req: Request) {
    const userContext = getUserContext();
    console.log(userContext);
    await this.service.logout(userContext.user.userId);
    return {
      ...RESPONSE_MESSAGES.SUCCESS,
    };
  }

  @Post('signup')
  @ApiBody({ type: SignUpRequestDTO })
  @HttpCode(200)
  public async requestOTP(@Body() dto: SignUpRequestDTO) {
    const user = await this.UserService.createUser(dto);
    const { accessToken } = await this.UserAccessTokenService.setAccessTokenToRedis(user);
    return {
      ...RESPONSE_MESSAGES.SUCCESS,
      data: {
        accessToken: accessToken,
      },
    };
  }
}
