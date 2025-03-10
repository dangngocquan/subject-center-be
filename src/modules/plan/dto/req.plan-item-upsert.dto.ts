import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class RequestUpsertPlanItemDto {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  id?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  code?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  credit?: number;

  @ApiPropertyOptional({
    isArray: true,
    type: () => String,
  })
  @IsArray()
  @IsOptional()
  prerequisites?: string[];

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  grade4?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  gradeLatin?: string;
}
