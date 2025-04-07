import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MajorEntity } from './entity/major.entity';
import { MajorItemEntity } from './entity/major-item.entity';
import { MajorController } from './major.controller';
import { MajorService } from './major.service';
import { ImportModule } from '../import/import.module';
import { ExportModule } from '../export/export.module';
import { AESModule } from '../aes/aes.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MajorEntity, MajorItemEntity]),
    ImportModule,
    ExportModule,
    AESModule,
  ],
  controllers: [MajorController],
  providers: [MajorService],
  exports: [MajorService],
})
export class MajorModule {}
