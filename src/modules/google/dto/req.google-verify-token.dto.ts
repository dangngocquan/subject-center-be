import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RequestGoogleVerifyTokenDto {
  @ApiProperty()
  @IsString()
  token: string;
}
