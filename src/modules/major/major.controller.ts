import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
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
import { EParamKey } from '../auth/authorization/authorization.type';
import { ExportService } from '../export/export.service';
import { ImportService } from '../import/import.service';
import { RequestMajorListQueryDto } from './dto/req.major-list.dto';
import { ResponseMajorDetailDto } from './dto/res.major-detail.dto';
import { ResponseMajorListDto } from './dto/res.major-list.dto';
import { ResponseMajorUpsertDto } from './dto/res.major-upsert.dto';
import { ResponseSampleJsonDto } from './dto/res.sample-json.dto';
import { MajorService } from './major.service';
import { TMajor } from './major.type';

@Controller({
  path: 'v1/majors',
})
@ApiTags('Major')
export class MajorController {
  constructor(
    private readonly majorService: MajorService,
    private readonly importService: ImportService,
    private readonly exportService: ExportService,
  ) {}

  @Get()
  @ApiResponse({ status: 200, type: ResponseMajorListDto })
  async getMajors(@Query() query: RequestMajorListQueryDto) {
    return await this.majorService.getMajors({ name: query?.name ?? null });
  }

  @Get('sample/json')
  @ApiResponse({ status: 200, type: ResponseSampleJsonDto })
  async downloadSampleMajorJson(@Res() res: Response) {
    const data = {
      name: 'Data Science, Hanoi University of Science (HUS)',
      subjects: [
        {
          name: 'Triết học Mác - Lênin',
          code: 'PHI1006',
          credit: 3,
          prerequisites: [],
        },
      ],
    };
    const jsonBuffer = await this.exportService.exportToJson(data);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="major.sample.json"',
    );
    res.send(jsonBuffer);
  }

  @Post('json')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a JSON file and extract data' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description:
      'Upload a JSON file containing an object with a "name" field and a list of items (subjects).\n\n' +
      '### **Structure:**\n' +
      '```json\n' +
      '{\n' +
      '  "name": "string",\n' +
      '  "items": [\n' +
      '    {\n' +
      '      "name": "string",\n' +
      '      "code": "string",\n' +
      '      "credit": "number",\n' +
      '      "prerequisites": ["string"],\n' +
      '      "genCode": "string",\n' +
      '      "parentGenCode": "string | null",\n' +
      '      "stt": "string",\n' +
      '      "level": "number",\n' +
      '      "selectionRule": "ALL | ONE | MULTI | null",\n' +
      '      "minCredits": "number | null",\n' +
      '      "minChildren": "number | null",\n' +
      '      "isLeaf": "boolean"\n' +
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
  @ApiResponse({ status: 201, type: ResponseMajorUpsertDto })
  async upsertMajorByImportJson(@UploadedFile() file: Express.Multer.File) {
    const result = await this.importService.importJson<TMajor>(file);
    if (result.isBadRequest) {
      throw new BadRequestException(result.message);
    }
    return await this.majorService.upsertMajor(result.data, {
      createNew: true,
    });
  }

  @Get(`:${EParamKey.MAJOR_ID}/detail`)
  @ApiResponse({ status: 200, type: ResponseMajorDetailDto })
  async getMajorById(@Param(EParamKey.MAJOR_ID) id: string) {
    if (!id) {
      throw new BadRequestException('Major ID is required');
    }
    return await this.majorService.getMajorById(Number(id));
  }
}
