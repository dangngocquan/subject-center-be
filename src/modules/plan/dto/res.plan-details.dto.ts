import { ApiProperty } from '@nestjs/swagger';
import { ResponsePlanItemDto } from './res.plan-item.dto';

class ResponsePlanCreditsDto {
  @ApiProperty()
  totalCredits: number;

  @ApiProperty()
  totalSubjects: number;

  @ApiProperty()
  totalSubjectsCompleted: number;

  @ApiProperty()
  totalCreditsCompleted: number;

  @ApiProperty()
  totalSubjectsIncomplete: number;

  @ApiProperty()
  totalCreditsIncomplete: number;

  @ApiProperty()
  totalSubjectsCanImprovement: number;

  @ApiProperty()
  totalCreditsCanImprovement: number;

  @ApiProperty()
  currentCPA: number;

  @ApiProperty({ type: Object })
  grades: Record<string, number>;

  @ApiProperty()
  totalGradeCompleted: number;

  @ApiProperty()
  totalGradeCanImprovement: number;
}

class ResponsePlanCPAMarkDto {
  @ApiProperty()
  grade4: number;

  @ApiProperty()
  type: string;

  @ApiProperty({ type: Object })
  details: {
    content: string;
  };
}

class ResponsePlanCPADto {
  @ApiProperty({ type: [ResponsePlanCPAMarkDto] })
  marks: ResponsePlanCPAMarkDto[];
}

class ResponsePlanCPASummaryDto {
  @ApiProperty({ type: ResponsePlanCPADto })
  withImprovements: ResponsePlanCPADto;

  @ApiProperty({ type: ResponsePlanCPADto })
  withoutImprovements: ResponsePlanCPADto;
}

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

export class ResponsePlanDetailsDto {
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

  @ApiProperty({ type: ResponsePlanCreditsDto })
  credits: ResponsePlanCreditsDto;

  @ApiProperty({ type: ResponsePlanCPASummaryDto })
  cpa: ResponsePlanCPASummaryDto;

  @ApiProperty({ type: [ResponsePlanBulkUpsertResultDto], required: false })
  result?: ResponsePlanBulkUpsertResultDto[];
}
