import { Module } from '@nestjs/common';
import { GradeConversionService } from './grade-conversion.service';

@Module({
  imports: [],
  controllers: [],
  providers: [GradeConversionService],
  exports: [GradeConversionService],
})
export class GradeConversionModule {}
