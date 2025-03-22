import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationService } from './authentication/authentication.service';
import jwtConfig from './authentication/config/jwt.config';
import securityConfig from './authentication/config/security.config';
import { AuthorizationService } from './authorization/authorization.service';

@Module({})
export class AuthModule {
  static forRoot(): DynamicModule {
    return {
      module: AuthModule,
      imports: [
        JwtModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [securityConfig, jwtConfig],
        }),
      ],
      controllers: [],
      providers: [AuthenticationService, AuthorizationService],
      exports: [AuthenticationService, AuthorizationService],
      global: true,
    };
  }
}
