import { Controller, Get, Res } from '@nestjs/common';
import { ExportService } from './export.service';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@Controller({
  path: 'v1/export',
})
@ApiTags('Export')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Get('csv')
  async downloadCsv(@Res() res: Response) {
    const data = [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
    ];
    const csvBuffer = await this.exportService.exportToCsv(data);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="data.csv"');
    res.send(csvBuffer);
  }

  @Get('json')
  async downloadJson(@Res() res: Response) {
    const data = {
      data: [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
      ],
    };
    const jsonBuffer = await this.exportService.exportToJson(data);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="data.json"');
    res.send(jsonBuffer);
  }
}
