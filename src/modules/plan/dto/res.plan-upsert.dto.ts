import { ApiProperty } from '@nestjs/swagger';
import { ResponsePlanItemDto } from './res.plan-item.dto';

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
}
