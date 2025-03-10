import { Injectable, Logger } from '@nestjs/common';
import { Parser } from 'json2csv';

@Injectable()
export class ExportService {
  private readonly logger = new Logger(ExportService.name);
  constructor() {}

  async exportToCsv(data: any[]): Promise<Buffer> {
    try {
      if (!data.length) {
        throw new Error('No data to export');
      }

      const fields = Object.keys(data[0]);
      const parser = new Parser({ fields });
      const csv = parser.parse(data);

      return Buffer.from(csv, 'utf8');
    } catch (error) {
      this.logger.error(`Error exporting data to CSV: ${error.message}`);
      return null;
    }
  }

  async exportToJson(data: any): Promise<Buffer> {
    try {
      return Buffer.from(JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
      this.logger.error(`Error exporting data to JSON: ${error.message}`);
      return null;
    }
  }
}
