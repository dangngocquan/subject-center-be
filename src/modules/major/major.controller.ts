import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ExportService } from '../export/export.service';
import { ImportService } from '../import/import.service';
import { RequestMajorListQueryDto } from './dto/req.major-list.dto';
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
  async getMajors(@Query() query: RequestMajorListQueryDto) {
    return await this.majorService.getMajors({ name: query?.name ?? null });
  }

  @Get('sample/json')
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
      'Upload a JSON file containing an object with a "name" field and a list of subjects.\n\n' +
      '### **Example Format:**\n' +
      '```json\n' +
      '{\n' +
      '  "name": "Alice",\n' +
      '  "subjects": [\n' +
      '    {\n' +
      '      "name": "string",\n' +
      '      "code": "string",\n' +
      '      "credit": 0,\n' +
      '      "prerequisites": ["string"]\n' +
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
  async upsertMajorByImportJson(@UploadedFile() file: Express.Multer.File) {
    const result = await this.importService.importJson<TMajor>(file);
    if (result.isBadRequest) {
      throw new BadRequestException(result.message);
    }
    return await this.majorService.upsertMajor(result.data, {
      createNew: true,
    });
  }
}
