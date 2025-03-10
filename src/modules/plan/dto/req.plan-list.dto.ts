import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class RequestPlanListQueryDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;
}
