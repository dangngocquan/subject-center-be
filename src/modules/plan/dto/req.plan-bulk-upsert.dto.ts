import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class RequestPlanBulkUpsertItemDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsNumber()
  credit: number;

  @ApiProperty()
  @IsString()
  gradeLatin: string;
}

export class RequestPlanBulkUpsertDto {
  @ApiProperty({ type: [RequestPlanBulkUpsertItemDto] })
  @IsArray()
  subjects: RequestPlanBulkUpsertItemDto[];
}
