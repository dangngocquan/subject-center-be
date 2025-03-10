import { Injectable, Logger } from '@nestjs/common';
import * as csv from 'csv-parser';
import { Readable } from 'stream';
import { TResponse } from '../../common/type';

@Injectable()
export class ImportService {
  private readonly logger = new Logger(ImportService.name);
  async importJson<T>(file: Express.Multer.File): Promise<TResponse<T>> {
    const result: TResponse<T> = {
      isBadRequest: false,
      message: '',
      data: null,
    };
    try {
      if (file.mimetype !== 'application/json') {
        result.isBadRequest = true;
        result.message = 'Invalid file type! Please upload a JSON file.';
        return result;
      }
      const jsonString = file.buffer.toString('utf8');
      result.data = JSON.parse(jsonString);
    } catch (error) {
      this.logger.error(`[importJson] ${JSON.stringify({ error })}`);
      result.isBadRequest = true;
      result.message = `${error.message || error.toString()}`;
    }
    return result;
  }

  async importCsv<T>(file: Express.Multer.File): Promise<TResponse<T>> {
    const result: TResponse<T> = {
      isBadRequest: false,
      message: '',
      data: null,
    };
    try {
      if (file.mimetype !== 'text/csv') {
        result.isBadRequest = true;
        result.message = 'Invalid file type! Please upload a CSV file.';
        return result;
      }
      await new Promise((resolve, reject) => {
        const results: any[] = [];
        const stream = Readable.from(file.buffer.toString('utf8'));
        stream
          .pipe(csv())
          .on('data', (data) => results.push(data))
          .on('end', () => {
            result.data = { data: results } as T;
            resolve(results);
          })
          .on('error', (error) => reject(error));
      });
    } catch (error) {
      this.logger.error(`[importCsv] ${JSON.stringify({ error })}`);
      result.isBadRequest = true;
      result.message = `${error.message || error.toString()}`;
    }
    return result;
  }
}
