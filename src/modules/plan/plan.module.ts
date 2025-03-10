import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExportModule } from '../export/export.module';
import { GradeConversionModule } from '../grade-conversion/grade-conversion.module';
import { ImportModule } from '../import/import.module';
import { PlanItemEntity } from './entity/plan-item.entity';
import { PlanEntity } from './entity/plan.entity';
import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PlanEntity, PlanItemEntity]),
    ImportModule,
    ExportModule,
    GradeConversionModule,
    AuthModule,
  ],
  controllers: [PlanController],
  providers: [PlanService],
  exports: [PlanService],
})
export class PlanModule {}
