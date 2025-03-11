import { Module } from '@nestjs/common';
import { ImportService } from './import.service';

@Module({
  controllers: [],
  providers: [ImportService],
  exports: [ImportService],
})
export class ImportModule {}
