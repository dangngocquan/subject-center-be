import { ApiProperty } from '@nestjs/swagger';
import { ResponsePlanItemDto } from './res.plan-item.dto';

class ResponsePlanBulkUpsertResultDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  gradeLatin: string;

  @ApiProperty()
  status: 'UPDATED' | 'FAILED' | 'NEW';

  @ApiProperty()
  message: string;
}

export class ResponsePlanUpsertDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty({ type: [ResponsePlanItemDto] })
  items: ResponsePlanItemDto[];

  @ApiProperty()
  accountId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: [ResponsePlanBulkUpsertResultDto], required: false })
  result?: ResponsePlanBulkUpsertResultDto[];
}
