import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { TPlanItem } from '../plan.type';
import { RequestUpsertPlanItemDto } from './req.plan-item-upsert.dto';

export class RequestUpsertPlanDto {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  id?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({
    isArray: true,
    type: () => RequestUpsertPlanItemDto,
  })
  @IsArray()
  @IsOptional()
  items?: TPlanItem[];
}
