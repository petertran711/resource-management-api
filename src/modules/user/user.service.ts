import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { UserEntity } from '../../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SwitchAuthenDto } from './dto/switch-authen.dto';

@Injectable()
export class UserService extends TypeOrmCrudService<UserEntity> {
  constructor(
    @InjectRepository(UserEntity) public repo: Repository<UserEntity>,
  ) {
    super(repo);
  }
  async setTwoFactorAuthenticationSecret(secret: string, userId: number) {
    return this.repo.update(userId, {
      twoFactorAuthenticationSecret: secret,
    });
  }

  async turnOnTwoFactorAuthentication(userId: number) {
    return this.repo.update(userId, {
      isTwoFactorAuthenticationEnabled: true,
    });
  }

  async switchTwoFactorAuthentication(dto: SwitchAuthenDto) {
    const user = await this.repo.findOne(dto.id);
    user.isTwoFactorAuthenticationEnabled = dto.value;
    return await this.repo.save(user);
  }
}
