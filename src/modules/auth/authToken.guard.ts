import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../users/user.service';
import { AuthHeaderKeys } from './auth.constant';
import { AuthService } from './auth.service';

@Injectable()
export class AuthTokenGuard implements CanActivate {
  private readonly logger = new Logger(AuthTokenGuard.name);
  @Inject(AuthService) private readonly authService: AuthService;
  @Inject(UserService) private readonly userService: UserService;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    let token: string = '';

    try {
      token = request.headers[`${AuthHeaderKeys.TOKEN}`] as string;
      if (!token) {
        this.logger.debug(`[canActivate] Not found token.`);
        throw new UnauthorizedException('Token is required');
      }
      const user = await this.authService.decodeToken(token);
      request['user'] = user;
      await this.userService.updateLastTimeLogin(user);
      return true;
    } catch (error) {
      this.logger.error(
        `[canActivate] ${JSON.stringify({ token })}, error: ${error?.message || error.toString()}`,
      );
      throw new UnauthorizedException(`${error?.message || error.toString()}`);
    }
  }
}
