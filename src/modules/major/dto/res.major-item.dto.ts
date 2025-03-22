import { ApiProperty } from '@nestjs/swagger';

export class ResponseMajorItemDto {
  @ApiProperty({ type: Number, required: false })
  id?: number;

  @ApiProperty({ type: String, required: false })
  name?: string;

  @ApiProperty({ type: String, required: false })
  code?: string;

  @ApiProperty({ type: Number, required: false })
  credit?: number;

  @ApiProperty({ type: [String], required: false })
  prerequisites?: string[];

  @ApiProperty({ type: Number, required: false })
  majorId?: number;

  @ApiProperty({ type: String, required: false })
  genCode?: string;

  @ApiProperty({ type: String, required: false, nullable: true })
  parentGenCode?: string | null;

  @ApiProperty({ type: String, required: false })
  stt?: string;

  @ApiProperty({ type: Number, required: false })
  level?: number;

  @ApiProperty({
    type: String,
    enum: ['ALL', 'ONE', 'MULTI'],
    required: false,
    nullable: true,
  })
  selectionRule?: 'ALL' | 'ONE' | 'MULTI' | null;

  @ApiProperty({ type: Number, required: false, nullable: true })
  minCredits?: number | null;

  @ApiProperty({ type: Number, required: false, nullable: true })
  minChildren?: number | null;

  @ApiProperty({ type: Boolean, required: false })
  isLeaf?: boolean;

  @ApiProperty({ type: Date })
  createdAt: Date;

  @ApiProperty({ type: Date })
  updatedAt: Date;
}
