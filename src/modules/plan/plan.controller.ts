import {
  BadRequestException,
  Body,
  Controller,
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
import { ApiAuthToken, AuthTokenUser } from '../auth/auth.decorator';
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
  @ApiAuthToken({
    summary: 'Get plans of user',
  })
  async getPlans(
    @AuthTokenUser() user: TUser,
    @Query() query: RequestPlanListQueryDto,
  ) {
    console.log({ user });
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

  @Get(':id/export/json')
  @ApiAuthToken()
  async downloadPlanJson(
    @Res() res: Response,
    @Param('id') id: string,
    @AuthTokenUser() user: TUser,
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
  @ApiAuthToken()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a JSON file and extract data' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description:
      'Upload a JSON file containing an object with a "name" field and a list of subjects.\n\n' +
      '### **Example Format:**\n' +
      '```json\n' +
      '{\n' +
      '  "name": "Your plan name",\n' +
      '  "items": [\n' +
      '    {\n' +
      '      "name": "string",\n' +
      '      "code": "string",\n' +
      '      "credit": 0,\n' +
      '      "prerequisites": ["string"]\n' +
      '      "gradeLatin": "string"\n' +
      '    }\n' +
      '  ]\n',
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
    @AuthTokenUser() userInfo: TUser,
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

  @Patch(':id/item')
  @ApiAuthToken({ summary: 'Update plan item' })
  async upsertPlanItem(
    @AuthTokenUser() userInfo: TUser,
    @Body() data: RequestUpsertPlanItemDto,
    @Param('id') id: string,
  ) {
    const plan = await this.planService.getPlanById(parseInt(id));
    if (!userInfo.accounts.map((a) => a.id).includes(plan.accountId)) {
      throw new UnauthorizedException('Permission denied');
    }
    return await this.planService.upsertPlanItem(data);
  }

  @Patch()
  @ApiAuthToken({ summary: 'Update plan' })
  async upsertPlan(
    @AuthTokenUser() userInfo: TUser,
    @Body() data: RequestUpsertPlanDto,
  ) {
    const result = await this.planService.upsertPlan(userInfo, data);
    if (result.isBadRequest) {
      throw new HttpException(result.message, result.status ?? 400);
    }
    return result;
  }

  @Get(':id/summary/subject')
  @ApiAuthToken({ summary: 'Get plan details' })
  async getPlanDetails(
    @AuthTokenUser() userInfo: TUser,
    @Param('id') id: string,
  ) {
    const result = await this.planService.getPlanSummary(
      userInfo,
      parseInt(id),
    );
    if (result.isBadRequest) {
      throw new HttpException(result.message, result.status ?? 400);
    }
    return result.data;
  }
}
