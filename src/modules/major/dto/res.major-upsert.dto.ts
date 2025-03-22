import { ApiProperty } from '@nestjs/swagger';
import { ResponseMajorDto } from './res.major.dto';

export class ResponseMajorUpsertDto {
  @ApiProperty({ type: Boolean })
  isBadRequest: boolean;

  @ApiProperty({ type: String })
  message: string;

  @ApiProperty({ type: ResponseMajorDto })
  data: ResponseMajorDto;
}
