import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { RequestGoogleVerifyTokenDto } from '../google/dto/req.google-verify-token.dto';
import { GoogleService } from '../google/google.service';
import { EPlatformProvider, EUserRole, TUser } from './type/user.type';
import { UsersService } from './user.service';

@Controller({
  path: 'v1/users',
})
@ApiTags('User')
export class UserController {
  constructor(
    private readonly userService: UsersService,
    private readonly googleService: GoogleService,
    private readonly authService: AuthService,
  ) {}

  @Post('auth/google')
  async authGoogle(@Body() body: RequestGoogleVerifyTokenDto): Promise<{
    token: string;
  }> {
    try {
      const googleResult = await this.googleService.verifyGoogleToken(
        body.token,
      );
      if (googleResult.isBadRequest) {
        throw new UnauthorizedException(googleResult.message);
      }
      const userResult = await this.userService.upsertUser({
        name: googleResult.data.email,
        role: EUserRole.USER,
        accounts: [
          {
            key: googleResult.data.email,
            provider: EPlatformProvider.GOOGLE,
          },
        ],
      });
      if (userResult.isBadRequest) {
        throw new UnauthorizedException(userResult.message);
      }
      const token = this.authService.encodeToken(userResult.data as TUser);
      return {
        token,
      };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
}
