import { ApiProperty } from '@nestjs/swagger';

export class ResponsePlanItemDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  credit: number;

  @ApiProperty({ type: [String] })
  prerequisites: string[];

  @ApiProperty()
  grade4: number;

  @ApiProperty()
  gradeLatin: string;

  @ApiProperty()
  planId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
