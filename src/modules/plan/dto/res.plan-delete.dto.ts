import { ApiProperty } from '@nestjs/swagger';

export class ResponsePlanDeleteDto {
  @ApiProperty()
  success: boolean;
}
