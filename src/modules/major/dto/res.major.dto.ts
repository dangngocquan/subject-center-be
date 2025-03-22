import { ApiProperty } from '@nestjs/swagger';
import { ResponseMajorItemDto } from './res.major-item.dto';

export class ResponseMajorDto {
  @ApiProperty({ type: Number, required: false })
  id?: number;

  @ApiProperty({ type: String, required: false })
  name?: string;

  @ApiProperty({ type: [ResponseMajorItemDto], required: false })
  items?: ResponseMajorItemDto[];
}
