import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GoogleService } from './google.service';
import { TResponse } from '../../common/type';
import { TGoogleTokenPayload } from './google.type';
import { RequestGoogleVerifyTokenDto } from './dto/req.google-verify-token.dto';

@Controller({
  path: 'v1/google',
})
@ApiTags('Google API')
export class GoogleController {
  constructor(private readonly googleService: GoogleService) {}

  @Post('verify-token')
  async verifyGoogleToken(
    @Body() body: RequestGoogleVerifyTokenDto,
  ): Promise<TResponse<TGoogleTokenPayload>> {
    return await this.googleService.verifyGoogleToken(body.token);
  }
}
