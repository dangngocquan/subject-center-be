import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';
import { TSubject } from '../major.type';

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
  subjects?: TSubject[];
}
