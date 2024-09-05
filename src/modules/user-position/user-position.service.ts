import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { UserPositionEntity } from '../../entities/user-position.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserPositionService extends TypeOrmCrudService<UserPositionEntity> {
  constructor(
    @InjectRepository(UserPositionEntity)
    public repo: Repository<UserPositionEntity>,
  ) {
    super(repo);
  }
}
