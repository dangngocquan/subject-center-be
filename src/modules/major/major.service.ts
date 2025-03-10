import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { TResponse } from '../../common/type';
import { MajorEntity } from './entity/major.entity';
import { SubjectEntity } from './entity/subject.entity';
import { TMajor, TSubject } from './major.type';

@Injectable()
export class MajorService {
  private readonly logger = new Logger(MajorService.name);

  constructor(
    @InjectRepository(MajorEntity)
    private readonly majorRepository: Repository<MajorEntity>,
    @InjectRepository(SubjectEntity)
    private readonly subjectRepository: Repository<SubjectEntity>,
  ) {}

  async getMajorById(id: number): Promise<MajorEntity> {
    try {
      return await this.majorRepository.findOne({
        relations: {
          subjects: true,
        },
        where: { id },
      });
    } catch (error) {
      this.logger.error(
        `[getMajorById]: Failed to get major by id ${id}, error: ${
          error.message || error.toString()
        }`,
      );
      return null;
    }
  }

  async getSubjectById(id: number): Promise<SubjectEntity> {
    try {
      return await this.subjectRepository.findOne({
        where: { id },
      });
    } catch (error) {
      this.logger.error(
        `[getSubjectById]: Failed to get subject by id ${id}, error: ${
          error.message || error.toString()
        }`,
      );
      return null;
    }
  }

  async getMajors(filter?: { name?: string }): Promise<TResponse<TMajor[]>> {
    const result: TResponse<TMajor[]> = {
      isBadRequest: false,
      message: '',
      data: [],
    };
    try {
      result.data = await this.majorRepository.find({
        relations: {
          subjects: true,
        },
        where: {
          name: ILike(`%${filter?.name?.toLocaleLowerCase()?.trim() ?? ''}%`),
        },
      });
    } catch (error) {
      this.logger.error(
        `[getMajors]: Failed to get majors, error: ${
          error.message || error.toString()
        }`,
      );
      result.isBadRequest = true;
      result.message = `${error.message || error.toString()}`;
    }
    return result;
  }

  async upsertMajor(data: TMajor): Promise<TResponse<TMajor>> {
    const result: TResponse<TMajor> = {
      isBadRequest: false,
      message: '',
      data: null,
    };
    try {
      let entity: MajorEntity = null;
      if (data.id) {
        for (const subject of data.subjects) {
          await this.upsertSubject({ ...subject, majorId: data.id });
        }
        entity = await this.getMajorById(data.id);
        entity.name = data.name ?? entity.name;
        await this.majorRepository.save(entity);
        result.data = entity;
        return result;
      }
      entity = await this.majorRepository.create({
        name: data.name,
      });
      await this.majorRepository.save(entity);
      result.data = {
        id: entity.id,
        name: entity.name,
        subjects: [],
      };
      for (const subject of data.subjects) {
        const upsert = await this.upsertSubject({
          ...subject,
          majorId: entity.id,
        });
        result.data.subjects.push(upsert.data);
      }
    } catch (error) {
      this.logger.error(
        `[upsertMajor]: Failed to upsert major, error: ${
          error.message || error.toString()
        }`,
      );
      result.isBadRequest = true;
      result.message = `${error.message || error.toString()}`;
    }
    return result;
  }

  async upsertSubject(data: TSubject): Promise<TResponse<TSubject>> {
    const result: TResponse<TMajor> = {
      isBadRequest: false,
      message: '',
      data: null,
    };
    try {
      let entity: SubjectEntity = null;
      if (data.id) {
        entity = await this.getSubjectById(data.id);
        entity.name = data.name ?? entity.name;
        entity.code = data.code ?? entity.code;
        entity.credit = data.credit ?? entity.credit;
        entity.prerequisites = data.prerequisites ?? entity.prerequisites;
        entity.majorId = data.majorId ?? entity.majorId;
        await this.subjectRepository.save(entity);
        result.data = entity;
        return result;
      }
      entity = await this.subjectRepository.create({
        name: data.name,
        code: data.code,
        credit: data.credit,
        prerequisites: data.prerequisites,
        majorId: data.majorId,
      });
      await this.subjectRepository.save(entity);
      result.data = entity;
    } catch (error) {
      this.logger.error(
        `[upsertMajor]: Failed to upsert subject ${JSON.stringify(data)}, error: ${
          error.message || error.toString()
        }`,
      );
      result.isBadRequest = true;
      result.message = `${error.message || error.toString()}`;
    }
    return result;
  }
}
