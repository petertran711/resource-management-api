import { UserPositionService } from './user-position.service';
import { Crud } from '../../constant/crud.decorator';
import { UserPositionEntity } from '../../entities/user-position.entity';
import { CrudController } from '@nestjsx/crud';
import { Auth } from '../../constant/auth.decorator';

@Crud({
  name: 'Vị trí',
  controller: 'users-position',
  model: {
    type: UserPositionEntity,
  },
  query: {
    join: { users: {}, skills: {} },
  },
  dto: {
    update: UserPositionEntity,
    create: UserPositionEntity,
  },
})
@Auth()
export class UserPositionController
  implements CrudController<UserPositionEntity>
{
  constructor(public readonly service: UserPositionService) {}

  get base(): CrudController<UserPositionEntity> {
    return this;
  }
}
