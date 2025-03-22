import { ApiProperty } from '@nestjs/swagger';

export class ResponseSampleJsonDto {
  @ApiProperty({ type: String, format: 'binary' })
  file: Buffer;
}
