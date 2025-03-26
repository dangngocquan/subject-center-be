import { ApiProperty } from '@nestjs/swagger';
import { ResponsePlanCreditsDto } from './res.plan-details.dto';

export class ResponsePlanListDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  accountId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ type: ResponsePlanCreditsDto })
  summary?: ResponsePlanCreditsDto;
}
