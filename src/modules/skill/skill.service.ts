import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { SkillEntity } from '../../entities/skill.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SkillService extends TypeOrmCrudService<SkillEntity> {
  constructor(
    @InjectRepository(SkillEntity)
    public repo: Repository<SkillEntity>,
  ) {
    super(repo);
  }
}
