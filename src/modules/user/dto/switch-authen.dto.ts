import { ApiProperty, PickType } from '@nestjs/swagger';
import { UserEntity } from '../../../entities/user.entity';
import { IsBoolean } from 'class-validator';

export class SwitchAuthenDto extends PickType(UserEntity, ['id']) {
  @IsBoolean()
  @ApiProperty({
    description: 'Giá trị của Switch',
    type: Boolean,
  })
  value: boolean;
}
