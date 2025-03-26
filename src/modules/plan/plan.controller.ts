import {
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
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
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
import { RequestPlanBulkUpsertItemDto } from './dto/req.plan-bulk-upsert.dto';
import { RequestUpsertPlanItemDto } from './dto/req.plan-item-upsert.dto';
import { RequestPlanListQueryDto } from './dto/req.plan-list.dto';
import { RequestUpsertPlanDto } from './dto/req.plan-upsert.dto';
import { ResponsePlanDeleteDto } from './dto/res.plan-delete.dto';
import { ResponsePlanDetailsDto } from './dto/res.plan-details.dto';
import { ResponsePlanListDto } from './dto/res.plan-list.dto';
import { ResponsePlanUpsertDto } from './dto/res.plan-upsert.dto';
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
  @ApiResponse({ status: 200, type: [ResponsePlanListDto] })
  async getPlans(
    @AuthenticationUser() user: TUser,
    @Query() query: RequestPlanListQueryDto,
  ) {
    const result = await this.planService.getPlans(user, {
      name: query?.name ?? null,
    });
    if (result.isBadRequest) {
      throw new HttpException(result.message, result.status ?? 400);
    }
    return result.data; // Includes progress in the response
  }

  @Get('export/sample/json')
  @ApiResponse({ status: 200, description: 'Download sample plan JSON file' })
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
  @ApiResponse({ status: 200, description: 'Download plan JSON file' })
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
  @ApiResponse({ status: 201, type: ResponsePlanUpsertDto })
  async upsertPlanByImportJson(
    @AuthenticationUser() userInfo: TUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const result = await this.importService.importJson<TPlan>(file);
    if (result.isBadRequest) {
      throw new HttpException(result.message, result.status ?? 400);
    }
    const resultUpsert = await this.planService.upsertPlan(
      userInfo,
      {
        name: result.data.name,
        accountId: userInfo.accounts[0].id,
        items: result.data.items,
      },
      { createNew: true },
    );
    console.log(resultUpsert);
    if (resultUpsert.isBadRequest) {
      throw new HttpException(resultUpsert.message, resultUpsert.status ?? 400);
    }
    return resultUpsert.data;
  }

  @Post()
  @CheckAuthentication(EAuthenticationType.TOKEN, {
    summary: 'Create new plan',
  })
  @ApiResponse({ status: 201, type: ResponsePlanUpsertDto })
  async createPlan(
    @AuthenticationUser() userInfo: TUser,
    @Body() data: RequestUpsertPlanDto,
  ) {
    const result = await this.planService.upsertPlan(
      userInfo,
      { ...data },
      { createNew: true },
    );
    if (result.isBadRequest) {
      throw new HttpException(result.message, result.status ?? 400);
    }
    return result.data;
  }

  @Patch(`:${EParamKey.PLAN_ID}/item`)
  @CheckAuthenticationAndAuthorization(
    EAuthenticationType.TOKEN,
    EAuthorizationType.PLAN,
    [EAuthorizationPermission.OWNER],
    { summary: 'Update plan item' },
  )
  @ApiResponse({ status: 200, type: ResponsePlanUpsertDto })
  async upsertPlanItem(@Body() data: RequestUpsertPlanItemDto) {
    const result = await this.planService.upsertPlanItem(data);
    if (result.isBadRequest) {
      throw new HttpException(result.message, result.status ?? 400);
    }
    return result.data;
  }

  @Patch(`:${EParamKey.PLAN_ID}`)
  @CheckAuthenticationAndAuthorization(
    EAuthenticationType.TOKEN,
    EAuthorizationType.PLAN,
    [EAuthorizationPermission.OWNER],
    { summary: 'Update plan' },
  )
  @ApiResponse({ status: 200, type: ResponsePlanUpsertDto })
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
  @ApiResponse({ status: 200, type: ResponsePlanDetailsDto })
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
  @ApiResponse({ status: 200, type: ResponsePlanDeleteDto })
  async deletePlan(@Param(`${EParamKey.PLAN_ID}`) planId: string) {
    const result = await this.planService.deletePlan(parseInt(planId));
    if (result.isBadRequest) {
      throw new HttpException(result.message, result.status ?? 400);
    }
    return result.data;
  }

  @Delete(`:${EParamKey.PLAN_ID}/items/:${EParamKey.PLAN_ITEM_ID}`)
  @CheckAuthenticationAndAuthorization(
    EAuthenticationType.TOKEN,
    EAuthorizationType.PLAN,
    [EAuthorizationPermission.OWNER],
    { summary: 'Delete plan item' },
  )
  @ApiResponse({ status: 200, description: 'Plan item deleted successfully' })
  async deletePlanItem(@Param(`${EParamKey.PLAN_ITEM_ID}`) planItemId: string) {
    const result = await this.planService.deletePlanItem(parseInt(planItemId));
    if (result.isBadRequest) {
      throw new HttpException(result.message, result.status ?? 400);
    }
    return result.data;
  }

  @Patch(`:${EParamKey.PLAN_ID}/items/json`)
  @CheckAuthenticationAndAuthorization(
    EAuthenticationType.TOKEN,
    EAuthorizationType.PLAN,
    [EAuthorizationPermission.OWNER],
    { summary: 'Import and bulk upsert plan items from JSON file' },
  )
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a JSON file and bulk upsert plan items' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description:
      'Upload a JSON file containing an object with a "subjects" field.\n\n' +
      '### **Example Format:**\n' +
      '```json\n' +
      '{\n' +
      '  "subjects": [\n' +
      '    {\n' +
      '      "name": "Toán cao cấp",\n' +
      '      "code": "MATH101",\n' +
      '      "credit": 3,\n' +
      '      "gradeLatin": "A"\n' +
      '    },\n' +
      '    {\n' +
      '      "name": "Vật lý đại cương",\n' +
      '      "code": "PHYS102",\n' +
      '      "credit": 4,\n' +
      '      "gradeLatin": "B+"\n' +
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
  @ApiResponse({
    status: 200,
    description: 'Bulk upsert plan items from JSON file',
    type: ResponsePlanUpsertDto, // Use the updated DTO
  })
  async importAndBulkUpsertPlanItems(
    @Param(`${EParamKey.PLAN_ID}`) planId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const result = await this.importService.importJson<{
      subjects: RequestPlanBulkUpsertItemDto[];
    }>(file);
    if (result.isBadRequest) {
      throw new HttpException(result.message, result.status ?? 400);
    }
    const bulkUpsertResult = await this.planService.bulkUpsertPlanItems(
      Number(planId),
      result.data.subjects,
    );
    if (bulkUpsertResult.isBadRequest) {
      throw new HttpException(
        bulkUpsertResult.message,
        bulkUpsertResult.status ?? 400,
      );
    }
    return bulkUpsertResult.data;
  }
}
