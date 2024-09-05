import { SkillService } from './skill.service';
import { Crud } from '../../constant/crud.decorator';
import { CrudController } from '@nestjsx/crud';
import { SkillEntity } from '../../entities/skill.entity';
import { Auth } from '../../constant/auth.decorator';

@Crud({
  name: 'Kỹ năng',
  controller: 'skill',
  model: {
    type: SkillEntity,
  },
  query: {
    join: {
      userPosition: {},
    },
  },
  dto: {
    update: SkillEntity,
    create: SkillEntity,
  },
})
@Auth()
export class SkillController implements CrudController<SkillEntity> {
  constructor(public readonly service: SkillService) {}

  get base(): CrudController<SkillEntity> {
    return this;
  }
}
