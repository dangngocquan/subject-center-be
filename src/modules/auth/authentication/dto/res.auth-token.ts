import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ResponseAuthTokenDto {
  @ApiProperty()
  @IsString()
  token: string;
}
