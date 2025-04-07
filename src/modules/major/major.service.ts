import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { TResponse } from '../../common/type';
import { MajorEntity } from './entity/major.entity';
import { MajorItemEntity } from './entity/major-item.entity';
import { TMajor, TMajorItem } from './major.type';
import { AESService } from '../aes/aes.service';

@Injectable()
export class MajorService {
  private readonly logger = new Logger(MajorService.name);

  constructor(
    @InjectRepository(MajorEntity)
    private readonly majorRepository: Repository<MajorEntity>,
    @InjectRepository(MajorItemEntity)
    private readonly subjectRepository: Repository<MajorItemEntity>,
    private readonly aesService: AESService,
  ) {}

  async getMajorById(id: number): Promise<MajorEntity> {
    try {
      return await this.majorRepository.findOne({
        relations: {
          items: true,
        },
        where: { id },
        order: {
          items: {
            orderIndex: 'ASC',
          },
        },
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

  async getSubjectById(id: number): Promise<MajorItemEntity> {
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
      const entities = await this.majorRepository.find({
        // relations: {
        //   items: true,
        // },
        where: {
          name: ILike(`%${filter?.name?.toLocaleLowerCase()?.trim() ?? ''}%`),
        },
        order: {
          orderIndex: 'ASC',
        },
      });

      result.data = entities;
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

  async upsertMajor(
    data: TMajor,
    options?: { createNew?: boolean },
  ): Promise<TResponse<TMajor>> {
    const result: TResponse<TMajor> = {
      isBadRequest: false,
      message: '',
      data: null,
    };
    try {
      let entity: MajorEntity = null;
      if (data.id && !options.createNew) {
        for (const subject of data.items) {
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
        items: [],
      };
      for (const subject of data.items) {
        const upsert = await this.upsertSubject({
          ...subject,
          majorId: entity.id,
        });
        result.data.items.push(upsert.data);
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

  async upsertSubject(data: TMajorItem): Promise<TResponse<TMajorItem>> {
    const result: TResponse<TMajorItem> = {
      isBadRequest: false,
      message: '',
      data: null,
    };
    try {
      let entity: MajorItemEntity = null;
      if (data.id) {
        entity = await this.getSubjectById(data.id);
        entity.majorId = data.majorId ?? entity.majorId;
        // New fields
        entity.genCode = data.genCode ?? entity.genCode;
        entity.parentGenCode = data.parentGenCode ?? entity.parentGenCode;
        entity.stt = data.stt ?? entity.stt;
        entity.code = data.code ?? entity.code;
        entity.name = data.name ?? entity.name;
        entity.credit = data.credit ?? entity.credit;
        entity.level = data.level ?? entity.level;
        entity.selectionRule = data.selectionRule ?? entity.selectionRule;
        entity.minCredits = data.minCredits ?? entity.minCredits;
        entity.minChildren = data.minChildren ?? entity.minChildren;
        entity.isLeaf = data.isLeaf ?? entity.isLeaf;
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
        genCode: data.genCode,
        parentGenCode: data.parentGenCode,
        stt: data.stt,
        level: data.level,
        selectionRule: data.selectionRule,
        minCredits: data.minCredits,
        minChildren: data.minChildren,
        isLeaf: data.isLeaf,
      });
      await this.subjectRepository.save(entity);
      result.data = entity;
    } catch (error) {
      this.logger.error(
        `[upsertSubject]: Failed to upsert subject ${JSON.stringify(data)}, error: ${
          error.message || error.toString()
        }`,
      );
      result.isBadRequest = true;
      result.message = `${error.message || error.toString()}`;
    }
    return result;
  }
}
