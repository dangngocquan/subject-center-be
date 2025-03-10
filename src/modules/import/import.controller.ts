import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ImportService } from './import.service';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';

@Controller('import')
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Post('json')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a JSON file and extract data' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description:
      'Upload a JSON file containing an array of objects.\n\nExample format:\n```json\n[\n  { "id": 1, "name": "Alice", "age": 25 },\n  { "id": 2, "name": "Bob", "age": 30 }\n]\n```',
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
  async uploadJson(@UploadedFile() file: Express.Multer.File) {
    const result = await this.importService.importJson<any>(file);
    if (result.isBadRequest) {
      throw new BadRequestException(result.message);
    }
    return result;
  }

  @Post('csv')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a CSV file and extract data' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description:
      'Upload a CSV file with the following format:\n\n```\nid,name,age\n1,Alice,25\n2,Bob,30\n```',
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
  async uploadCsv(@UploadedFile() file: Express.Multer.File) {
    const result = await this.importService.importCsv<any>(file);
    if (result.isBadRequest) {
      throw new BadRequestException(result.message);
    }
    return result;
  }
}
