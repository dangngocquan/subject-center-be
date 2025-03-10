import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { TResponse } from '../../common/type';
import { GradeConversionService } from '../grade-conversion/grade-conversion.service';
import { TUser } from '../user/type/user.type';
import { PlanItemEntity } from './entity/plan-item.entity';
import { PlanEntity } from './entity/plan.entity';
import { TPlan, TPlanItem } from './plan.type';

@Injectable()
export class PlanService {
  private readonly logger = new Logger(PlanService.name);

  constructor(
    @InjectRepository(PlanEntity)
    private readonly planRepository: Repository<PlanEntity>,
    @InjectRepository(PlanItemEntity)
    private readonly planItemRepository: Repository<PlanItemEntity>,
    private readonly gradeConversionService: GradeConversionService,
  ) {}

  async getPlanById(id: number): Promise<PlanEntity> {
    try {
      return await this.planRepository.findOne({
        relations: {
          items: true,
        },
        where: { id },
      });
    } catch (error) {
      this.logger.error(
        `[getPlanById]: Failed to get plan by id ${id}, error: ${
          error.message || error.toString()
        }`,
      );
      return null;
    }
  }

  async getPlanItemById(id: number): Promise<PlanItemEntity> {
    try {
      return await this.planItemRepository.findOne({
        where: { id },
      });
    } catch (error) {
      this.logger.error(
        `[getPlanItemById]: Failed to get plan item by id ${id}, error: ${
          error.message || error.toString()
        }`,
      );
      return null;
    }
  }

  async getPlans(
    user: TUser,
    filter?: { name?: string },
  ): Promise<TResponse<TPlan[]>> {
    const result: TResponse<TPlan[]> = {
      isBadRequest: false,
      message: '',
      data: [],
    };
    try {
      console.log(user);
      result.data = await this.planRepository.find({
        where: {
          name: ILike(`%${filter?.name?.toLocaleLowerCase()?.trim() ?? ''}%`),
          accountId: In(user.accounts.map((account) => account.id)),
        },
      });
    } catch (error) {
      this.logger.error(
        `[getPlans]: Failed to get plans, error: ${
          error.message || error.toString()
        }`,
      );
      result.isBadRequest = true;
      result.message = `${error.message || error.toString()}`;
    }
    return result;
  }

  async upsertPlan(user: TUser, data: TPlan): Promise<TResponse<TPlan>> {
    const result: TResponse<TPlan> = {
      isBadRequest: false,
      message: '',
      data: null,
      status: 201,
    };
    try {
      let entity: PlanEntity = null;
      if (data.id) {
        entity = await this.getPlanById(data.id);
        if (!user.accounts.map((a) => a.id).includes(entity.accountId)) {
          result.isBadRequest = true;
          result.message = 'Unauthorized';
          result.status = 401;
          return result;
        }
        for (const subject of data.items) {
          await this.upsertPlanItem({ ...subject, planId: data.id });
        }
        entity = await this.getPlanById(data.id);
        entity.name = data.name ?? entity.name;
        await this.planRepository.save(entity);
        result.data = entity;
        return result;
      }
      entity = await this.planRepository.create({
        name: data.name,
        accountId: user.accounts[0].id,
      });
      await this.planRepository.save(entity);
      result.data = {
        id: entity.id,
        name: entity.name,
        accountId: entity.accountId,
        items: [],
      };
      for (const subject of data.items) {
        const upsert = await this.upsertPlanItem({
          ...subject,
          planId: entity.id,
        });
        result.data.items.push(upsert.data);
      }
    } catch (error) {
      this.logger.error(
        `[upsertPlan]: Failed to upsert plan, error: ${
          error.message || error.toString()
        }`,
      );
      result.isBadRequest = true;
      result.message = `${error.message || error.toString()}`;
    }
    return result;
  }

  async upsertPlanItem(data: TPlanItem): Promise<TResponse<TPlanItem>> {
    const result: TResponse<TPlan> = {
      isBadRequest: false,
      message: '',
      data: null,
    };
    try {
      let entity: PlanItemEntity = null;
      if (data.id) {
        entity = await this.getPlanItemById(data.id);
        entity.name = data.name ?? entity.name;
        entity.code = data.code ?? entity.code;
        entity.credit = data.credit ?? entity.credit;
        entity.prerequisites = data.prerequisites ?? entity.prerequisites;
        entity.planId = data.planId ?? entity.planId;
        entity.gradeLatin = data.gradeLatin ?? entity.gradeLatin;
        entity.grade4 = this.gradeConversionService.convertGradeLatinToGrade4(
          entity.gradeLatin,
        );
        await this.planItemRepository.save(entity);
        result.data = entity;
        return result;
      }
      entity = await this.planItemRepository.create({
        name: data.name,
        code: data.code,
        credit: data.credit,
        prerequisites: data.prerequisites,
        planId: data.planId,
        grade4: this.gradeConversionService.convertGradeLatinToGrade4(
          data.gradeLatin,
        ),
        gradeLatin: data.gradeLatin,
      });
      await this.planItemRepository.save(entity);
      result.data = entity;
    } catch (error) {
      this.logger.error(
        `[upsertPlanItem]: Failed to upsert plan item ${JSON.stringify(data)}, error: ${
          error.message || error.toString()
        }`,
      );
      result.isBadRequest = true;
      result.message = `${error.message || error.toString()}`;
    }
    return result;
  }
}
