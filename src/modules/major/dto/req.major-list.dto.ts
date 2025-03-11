import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class RequestMajorListQueryDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;
}
