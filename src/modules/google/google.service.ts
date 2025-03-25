import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OAuth2Client } from 'google-auth-library';
import { GoogleConfig } from './google.config';
import { TGoogleTokenPayload } from './google.type';

@Injectable()
export class GoogleService {
  private readonly logger = new Logger(GoogleService.name);
  constructor(private readonly configService: ConfigService) {}

  async verifyGoogleToken(token: string): Promise<{
    isBadRequest: boolean;
    message: string;
    data?: TGoogleTokenPayload;
  }> {
    const result: {
      isBadRequest: boolean;
      message: string;
      data: TGoogleTokenPayload | null;
    } = {
      isBadRequest: false,
      message: '',
      data: null,
    };

    try {
      const config: GoogleConfig = this.configService.get<GoogleConfig>(
        'google',
        {
          infer: true,
        },
      );
      const client = new OAuth2Client({
        clientId: config.clientId,
        clientSecret: config.clientSecret,
      });
      result.data = await client
        .getTokenInfo(token)
        .then((data) => ({ email: data.email }) as TGoogleTokenPayload)
        .catch((reason) => {
          result.message = reason.message;
          return { email: null } as TGoogleTokenPayload;
        });
      if (result.data.email === null) {
        result.isBadRequest = true;
        result.message = 'Invalid token google';
      }
    } catch (error) {
      this.logger.error(
        `[verifyGoogleToken]: Failed to verify google token, error: ${
          error.message || error.toString()
        }`,
      );
      result.isBadRequest = true;
      result.message = `${error.message || error.toString()}`;
    }
    return result;
  }
}
