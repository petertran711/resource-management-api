import { PickType } from '@nestjs/swagger';
import { UserEntity } from '../../../entities/user.entity';

export class ResetPassDto extends PickType(UserEntity, ['password', 'email']) {}
