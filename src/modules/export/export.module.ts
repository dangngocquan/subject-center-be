import { Module } from '@nestjs/common';
import { ExportService } from './export.service';

@Module({
  controllers: [],
  providers: [ExportService],
  exports: [ExportService],
})
export class ExportModule {}
