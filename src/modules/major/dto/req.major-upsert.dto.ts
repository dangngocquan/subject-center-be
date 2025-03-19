import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsBoolean,
} from 'class-validator';
import { TMajorItem } from '../major.type';

export class RequestUpsertSubjectDto {
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
  @IsString()
  @IsOptional()
  genCode?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  parentGenCode?: string | null;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  stt?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  level?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  selectionRule?: 'ALL' | 'ONE' | 'MULTI' | null;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  minCredits?: number | null;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  minChildren?: number | null;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isLeaf?: boolean;
}

export class RequestUpsertMajorDto {
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
    type: () => RequestUpsertSubjectDto,
  })
  @IsArray()
  @IsOptional()
  items?: TMajorItem[];
}
