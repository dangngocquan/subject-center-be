import { Controller, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@Controller('v1/auth')
@ApiTags('Auth')
export class AuthController {
  @Inject(AuthService)
  private readonly authService: AuthService;
}
