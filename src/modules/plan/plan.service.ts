import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, In, Repository } from 'typeorm';
import { TResponse } from '../../common/type';
import {
  EGradeLatin,
  GRADE_CONVERSION_LATIN_TO_4,
  GRADE_GRADUATION,
} from '../grade-conversion/constants';
import { GradeConversionService } from '../grade-conversion/grade-conversion.service';
import { TUser } from '../user/type/user.type';
import { PlanItemEntity } from './entity/plan-item.entity';
import { PlanEntity } from './entity/plan.entity';
import {
  EPlanCPAMarkType,
  TPlan,
  TPlanCPA,
  TPlanCPASummary,
  TPlanCreditSummary,
  TPlanItem,
  TPlanSummary,
} from './plan.type';

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

  async upsertPlan(
    user: TUser,
    data: TPlan,
    options?: { createNew?: boolean },
  ): Promise<TResponse<TPlan>> {
    const result: TResponse<TPlan> = {
      isBadRequest: false,
      message: '',
      data: null,
      status: 201,
    };
    try {
      let entity: PlanEntity = null;
      if (data.id && !options.createNew) {
        entity = await this.getPlanById(data.id);
        if (!user.accounts.map((a) => a.id).includes(entity.accountId)) {
          result.isBadRequest = true;
          result.message = 'Unauthorized';
          result.status = 401;
          return result;
        }
        if (!entity) {
          result.isBadRequest = true;
          result.message = 'Not found';
          result.status = 404;
          return result;
        }
        for (const subject of data.items) {
          await this.upsertPlanItem({ ...subject, planId: entity.id });
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

  async getPlanCreditSummary(
    user: TUser,
    planId: number,
  ): Promise<TResponse<TPlanCreditSummary>> {
    const result: TResponse<TPlanCreditSummary> = {
      isBadRequest: false,
      message: '',
      data: {
        items: [],
        totalCredits: 0,
        totalSubjects: 0,
        totalSubjectsCompleted: 0,
        totalCreditsCompleted: 0,
        totalSubjectsIncomplete: 0,
        totalCreditsIncomplete: 0,
        totalSubjectsCanImprovement: 0,
        totalCreditsCanImprovement: 0,
        currentCPA: 0,
        grades: {},
        totalGradeCompleted: 0,
        totalGradeCanImprovement: 0,
      },
      status: 200,
    };
    try {
      const plan: TPlan = await this.getPlanById(planId);
      if (!user.accounts.map((a) => a.id).includes(plan.accountId)) {
        result.isBadRequest = true;
        result.message = 'Unauthorized';
        result.status = 401;
        return result;
      }
      if (!plan) {
        result.isBadRequest = true;
        result.message = 'Plan not found';
        result.status = 404;
        return result;
      }
      result.data.items = plan.items;
      plan.items.forEach((item) => {
        const credits = parseInt(`${item.credit}`);
        result.data.totalCredits += credits;
        result.data.totalSubjects++;
        // Has grade data
        if (item.grade4) {
          // Summary grade type
          if (!result.data.grades[item.gradeLatin]) {
            result.data.grades[item.gradeLatin] = {
              gradeLatin: item.gradeLatin,
              count: 0,
              credits: 0,
            };
          }
          result.data.grades[item.gradeLatin].count++;
          result.data.grades[item.gradeLatin].credits += credits;
          // Grade > F
          if (item.grade4 > 0) {
            result.data.totalSubjectsCompleted++;
            result.data.totalCreditsCompleted += credits;
            result.data.totalGradeCompleted += credits * item.grade4;
            // Grade D, D+
            if (item.grade4 < GRADE_CONVERSION_LATIN_TO_4[EGradeLatin.C]) {
              result.data.totalSubjectsCanImprovement++;
              result.data.totalCreditsCanImprovement += credits;
              result.data.totalGradeCanImprovement += credits * item.grade4;
            }
          }
          // Grade F
          else {
            result.data.totalSubjectsIncomplete++;
            result.data.totalCreditsIncomplete += credits;
            result.data.totalSubjectsCanImprovement++;
            result.data.totalCreditsCanImprovement += credits;
          }
        }
        // Don't have grade data
        else {
          result.data.totalSubjectsIncomplete++;
          result.data.totalCreditsIncomplete += credits;
        }
      });
      result.data.currentCPA =
        result.data.totalCreditsCompleted > 0
          ? result.data.totalGradeCompleted / result.data.totalCreditsCompleted
          : 0;
    } catch (error) {
      this.logger.error(
        `[getPlanDetail]: Failed to get plan detail for user ${JSON.stringify(
          user,
        )} and plan ${planId}, error: ${error.message || error.toString()}`,
      );
      result.isBadRequest = true;
      result.message = `${error.message || error.toString()}`;
      result.status = 500;
    }
    return result;
  }

  async getPlanCPASummary(
    data: TPlanCreditSummary,
  ): Promise<TResponse<TPlanCPASummary>> {
    const result: TResponse<TPlanCPASummary> = {
      isBadRequest: false,
      message: '',
      data: null,
      status: 200,
    };
    try {
      if (data.totalCredits == 0) {
        result.isBadRequest = true;
        result.message =
          'Total subjects or total credits is zero. No data to generate CPA summary';
        result.status = 400;
        return result;
      }
      const currentMark = {
        grade4: this.gradeConversionService.roundGradeGraduation(
          data.currentCPA,
        ),
        type: EPlanCPAMarkType.CURRENT,
        details: {
          content: `You current CPA (${data.currentCPA})`,
        },
      };
      const graduationMarks = GRADE_GRADUATION.map((mark) => ({
        grade4: mark.minGrade4,
        type: EPlanCPAMarkType.GRADUATION_MARK,
        details: {
          content: mark.description,
        },
      }));

      // CPA Without Improvements
      const withoutImprovements: TPlanCPA = {
        marks: structuredClone(graduationMarks),
      };
      withoutImprovements.marks.push(currentMark);

      const minCPAWithoutImprovement = this.getCPAInCase(data, EGradeLatin.D, {
        replaceImprovementSubjects: false,
      });
      withoutImprovements.marks.push({
        grade4: this.gradeConversionService.roundGradeGraduation(
          minCPAWithoutImprovement,
        ),
        type: EPlanCPAMarkType.MIN,
        details: {
          content: `Your minimum CPA (${minCPAWithoutImprovement}). This occurs when you receive a grade of D in all incomplete subjects.`,
        },
      });

      const maxCPAWithoutImprovement = this.getCPAInCase(
        data,
        EGradeLatin.A_PLUS,
        { replaceImprovementSubjects: false },
      );
      withoutImprovements.marks.push({
        grade4: this.gradeConversionService.roundGradeGraduation(
          maxCPAWithoutImprovement,
        ),
        type: EPlanCPAMarkType.MAX,
        details: {
          content: `Your maximum CPA (${maxCPAWithoutImprovement}). This occurs when you receive a grade of A+ in all incomplete subjects.`,
        },
      });

      // CPA With Improvements
      const withImprovements: TPlanCPA = {
        marks: GRADE_GRADUATION.map((mark) => ({
          grade4: mark.minGrade4,
          type: EPlanCPAMarkType.GRADUATION_MARK,
          details: {
            content: mark.description,
          },
        })),
      };
      withImprovements.marks.push(currentMark);

      const minCPAWithImprovements = this.getCPAInCase(data, EGradeLatin.D, {
        replaceImprovementSubjects: true,
      });
      withImprovements.marks.push({
        grade4: this.gradeConversionService.roundGradeGraduation(
          minCPAWithImprovements,
        ),
        type: EPlanCPAMarkType.MIN,
        details: {
          content: `Your minimum CPA (${minCPAWithImprovements}). This occurs when you receive a grade of D in all incomplete subjects and improvement subjects.`,
        },
      });

      const maxCPAWithImprovements = this.getCPAInCase(
        data,
        EGradeLatin.A_PLUS,
        { replaceImprovementSubjects: true },
      );
      withImprovements.marks.push({
        grade4: this.gradeConversionService.roundGradeGraduation(
          maxCPAWithImprovements,
        ),
        type: EPlanCPAMarkType.MAX,
        details: {
          content: `Your maximum CPA (${maxCPAWithImprovements}). This occurs when you receive a grade of A+ in all incomplete subjects and improvement subjects.`,
        },
      });
      result.data = {
        withoutImprovements: {
          marks: withoutImprovements.marks.sort((a, b) => a.grade4 - b.grade4),
        },
        withImprovements: {
          marks: withImprovements.marks.sort((a, b) => a.grade4 - b.grade4),
        },
      };
    } catch (error) {
      this.logger.error(
        `[getPlanCPASummary]: Failed to get plan CPA summary, error: ${
          error.message || error.toString()
        }`,
      );
      result.isBadRequest = true;
      result.message = `${error.message || error.toString()}`;
      result.status = 500;
    }
    return result;
  }

  getCPAInCase(
    data: TPlanCreditSummary,
    replaceGrade?: EGradeLatin, // For incomplete subjects
    options?: { replaceImprovementSubjects?: boolean },
  ): number {
    try {
      if (options?.replaceImprovementSubjects) {
        return (
          (data.totalGradeCompleted -
            data.totalGradeCanImprovement +
            (data.totalCreditsIncomplete + data.totalCreditsCanImprovement) *
              GRADE_CONVERSION_LATIN_TO_4[replaceGrade]) /
          data.totalCredits
        );
      }
      return (
        (data.totalGradeCompleted +
          data.totalCreditsIncomplete *
            GRADE_CONVERSION_LATIN_TO_4[replaceGrade]) /
        data.totalCredits
      );
    } catch (error) {
      this.logger.error(
        `[getCPAInCase] ${JSON.stringify({ data, replaceGrade, options })} error: ${error.message || error.toString()}`,
      );
      return -1;
    }
  }

  async getPlanSummary(
    user: TUser,
    planId: number,
  ): Promise<TResponse<TPlanSummary>> {
    const result: TResponse<TPlanSummary> = {
      isBadRequest: false,
      message: '',
      data: null,
      status: 200,
    };
    try {
      const creditsSummary = await this.getPlanCreditSummary(user, planId);
      const cpaSummary = await this.getPlanCPASummary(creditsSummary.data);
      result.data = {
        credits: creditsSummary.data,
        cpa: cpaSummary.data,
      };
    } catch (error) {
      this.logger.error(
        `[getPlanSummary]: Failed to get plan summary for user ${JSON.stringify(
          user,
        )} and plan ${planId}, error: ${error.message || error.toString()}`,
      );
      result.isBadRequest = true;
      result.message = `${error.message || error.toString()}`;
      result.status = 500;
    }
    return result;
  }
}
