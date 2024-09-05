import { ApiProperty, PickType } from '@nestjs/swagger';
import { UserEntity } from '../../../entities/user.entity';

export class twofactorAuthenDto extends PickType(UserEntity, ['email']) {
  @ApiProperty({
    description: 'twoFactorAuthenticationCode',
    type: String,
  })
  twoFactorAuthenticationCode: string;
}
