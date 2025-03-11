import { Injectable, Logger } from '@nestjs/common';
import { EGradeLatin, GRADE_CONVERSION_LATIN_TO_4 } from './constants';

@Injectable()
export class GradeConversionService {
  private readonly logger = new Logger(GradeConversionService.name);
  constructor() {}

  convertGradeLatinToGrade4(gradeLatin: string): number {
    try {
      if (!(Object.values(EGradeLatin) as string[]).includes(gradeLatin)) {
        return null;
      }
      return GRADE_CONVERSION_LATIN_TO_4[gradeLatin];
    } catch (error) {
      this.logger.error(
        `[convertGradeLatinToGrade4]: Failed to convert grade ${gradeLatin} from latin to 4-point scale, error: ${
          error.message || error.toString()
        }`,
      );
      return null;
    }
  }

  roundGradeGraduation(grade: number): number {
    try {
      return Math.round(grade * 100) / 100;
    } catch (error) {
      this.logger.error(
        `[roundGradeGraduation]: Failed to round graduation grade, error: ${
          error.message || error.toString()
        }`,
      );
      return null;
    }
  }
}
