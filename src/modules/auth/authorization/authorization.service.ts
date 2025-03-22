import { Injectable, Logger } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { PlanService } from '../../plan/plan.service';
import { TUser } from '../../user/type/user.type';
import { UsersService } from '../../user/user.service';
import { TResultAuthorizationGuard } from './authorization.type';

@Injectable()
export class AuthorizationService {
  private readonly logger = new Logger(AuthorizationService.name);
  private userService: UsersService;
  private planService: PlanService;

  constructor(private moduleRef: ModuleRef) {}

  onModuleInit() {
    this.userService = this.moduleRef.get(UsersService, { strict: false });
    this.planService = this.moduleRef.get(PlanService, { strict: false });
  }

  async isOwnerPlan(user: TUser, planId: number) {
    const result: TResultAuthorizationGuard = {
      canActivate: false,
      message: '',
    };
    try {
      const resultPlanCheck = await this.planService.isOwnerPlan(
        user.accounts.map((a) => a.id),
        planId,
      );
      result.canActivate = resultPlanCheck.data.isOwner;
      result.message = resultPlanCheck.message;
    } catch (error) {
      this.logger.error(
        `[isOwnerPlan]: Failed to check if user ${user.id} is owner of plan ${planId}, error: ${
          error.message || error.toString()
        }`,
      );
      result.message = `${error.message || error.toString()}`;
      result.canActivate = false;
    }
    return result;
  }
}
