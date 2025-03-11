import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MajorEntity } from './entity/major.entity';
import { SubjectEntity } from './entity/subject.entity';
import { MajorController } from './major.controller';
import { MajorService } from './major.service';
import { ImportModule } from '../import/import.module';
import { ExportModule } from '../export/export.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MajorEntity, SubjectEntity]),
    ImportModule,
    ExportModule,
  ],
  controllers: [MajorController],
  providers: [MajorService],
  exports: [MajorService],
})
export class MajorModule {}
