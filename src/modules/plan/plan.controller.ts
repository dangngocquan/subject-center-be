import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { CheckAuthenticationAndAuthorization } from '../auth/auth.decorator';
import {
  AuthenticationUser,
  CheckAuthentication,
} from '../auth/authentication/authentication.decorator';
import { EAuthenticationType } from '../auth/authentication/authentication.type';
import {
  EAuthorizationPermission,
  EAuthorizationType,
  EParamKey,
} from '../auth/authorization/authorization.type';
import { ExportService } from '../export/export.service';
import { ImportService } from '../import/import.service';
import { TUser } from '../user/type/user.type';
import { RequestUpsertPlanItemDto } from './dto/req.plan-item-upsert.dto';
import { RequestPlanListQueryDto } from './dto/req.plan-list.dto';
import { RequestUpsertPlanDto } from './dto/req.plan-upsert.dto';
import { PlanService } from './plan.service';
import { TPlan } from './plan.type';

@Controller({
  path: 'v1/plans',
})
@ApiTags('Plan')
export class PlanController {
  constructor(
    private readonly planService: PlanService,
    private readonly importService: ImportService,
    private readonly exportService: ExportService,
  ) {}

  @Get()
  @CheckAuthentication(EAuthenticationType.TOKEN, {
    summary: 'Get plans of user',
  })
  async getPlans(
    @AuthenticationUser() user: TUser,
    @Query() query: RequestPlanListQueryDto,
  ) {
    return await this.planService.getPlans(user, { name: query?.name ?? null });
  }

  @Get('export/sample/json')
  async downloadSamplePlanJson(@Res() res: Response) {
    const data = {
      name: 'Your plan name',
      subjects: [
        {
          name: 'Triết học Mác - Lênin',
          code: 'PHI1006',
          credit: 3,
          prerequisites: [],
          grade: 'A',
        },
      ],
    };
    const jsonBuffer = await this.exportService.exportToJson(data);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="plan.sample.json"',
    );
    res.send(jsonBuffer);
  }

  @Get(`:${EParamKey.PLAN_ID}/export/json`)
  @CheckAuthenticationAndAuthorization(
    EAuthenticationType.TOKEN,
    EAuthorizationType.PLAN,
    [EAuthorizationPermission.OWNER],
    { summary: 'Export plan' },
  )
  async downloadPlanJson(
    @Res() res: Response,
    @Param(`${EParamKey.PLAN_ID}`) id: string,
    @AuthenticationUser() user: TUser,
  ) {
    const data = await this.planService.getPlanById(parseInt(id));
    if (!data) {
      throw new HttpException('Plan not found', 404);
    }
    if (!user.accounts.map((a) => a.id).includes(data.accountId)) {
      throw new UnauthorizedException('You are not plan owner.');
    }
    const jsonBuffer = await this.exportService.exportToJson(data);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${user.id}.${data.id}.json"`,
    );
    res.send(jsonBuffer);
  }

  @Post('import/json')
  @CheckAuthentication(EAuthenticationType.TOKEN)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a JSON file and extract data' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description:
      'Upload a JSON file containing an object with a "name" field and a list of items.\n\n' +
      '### **Example Format:**\n' +
      '```json\n' +
      '{\n' +
      '  "name": "Your plan name",\n' +
      '  "items": [\n' +
      '    {\n' +
      '      "name": "string",\n' +
      '      "code": "string",\n' +
      '      "credit": 0,\n' +
      '      "prerequisites": ["string"],\n' +
      '      "grade4": 0,\n' +
      '      "gradeLatin": "string"\n' +
      '    }\n' +
      '  ]\n' +
      '}\n' +
      '```',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async upsertPlanByImportJson(
    @AuthenticationUser() userInfo: TUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const result = await this.importService.importJson<TPlan>(file);
    if (result.isBadRequest) {
      throw new BadRequestException(result.message);
    }
    return await this.planService.upsertPlan(
      userInfo,
      {
        name: result.data.name,
        accountId: userInfo.accounts[0].id,
        items: result.data.items,
      },
      { createNew: true },
    );
  }

  @Patch(`:${EParamKey.PLAN_ID}/item`)
  @CheckAuthenticationAndAuthorization(
    EAuthenticationType.TOKEN,
    EAuthorizationType.PLAN,
    [EAuthorizationPermission.OWNER],
    { summary: 'Update plan item' },
  )
  async upsertPlanItem(@Body() data: RequestUpsertPlanItemDto) {
    return await this.planService.upsertPlanItem(data);
  }

  @Patch(`:${EParamKey.PLAN_ID}`)
  @CheckAuthenticationAndAuthorization(
    EAuthenticationType.TOKEN,
    EAuthorizationType.PLAN,
    [EAuthorizationPermission.OWNER],
    { summary: 'Update plan' },
  )
  async upsertPlan(
    @AuthenticationUser() userInfo: TUser,
    @Body() data: RequestUpsertPlanDto,
    @Param(`${EParamKey.PLAN_ID}`) planId: string,
  ) {
    const result = await this.planService.upsertPlan(userInfo, {
      ...data,
      id: Number(planId),
    });
    if (result.isBadRequest) {
      throw new HttpException(result.message, result.status ?? 400);
    }
    return result;
  }

  @Get(`:${EParamKey.PLAN_ID}/details`)
  @CheckAuthenticationAndAuthorization(
    EAuthenticationType.TOKEN,
    EAuthorizationType.PLAN,
    [EAuthorizationPermission.OWNER],
    { summary: 'Get plan details' },
  )
  async getPlanDetails(@Param(`${EParamKey.PLAN_ID}`) id: string) {
    const result = await this.planService.getPlanSummary(Number(id));
    if (result.isBadRequest) {
      throw new HttpException(result.message, result.status ?? 400);
    }
    return result.data;
  }

  @Delete(`:${EParamKey.PLAN_ID}`)
  @CheckAuthenticationAndAuthorization(
    EAuthenticationType.TOKEN,
    EAuthorizationType.PLAN,
    [EAuthorizationPermission.OWNER],
    { summary: 'Delete plan' },
  )
  async deletePlan(@Param(`${EParamKey.PLAN_ID}`) planId: string) {
    const result = await this.planService.deletePlan(parseInt(planId));
    if (result.isBadRequest) {
      throw new HttpException(result.message, result.status ?? 400);
    }
    return result.data;
  }
}
