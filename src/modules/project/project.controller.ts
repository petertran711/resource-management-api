import { ProjectService } from './project.service';
import { Crud } from '../../constant/crud.decorator';
import { ProjectEntity } from '../../entities/project.entity';
import { CrudController } from '@nestjsx/crud';
import { Param, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Auth } from '../../constant/auth.decorator';

@Crud({
  name: 'Dự án',
  controller: 'projects',
  model: {
    type: ProjectEntity,
  },
  query: {
    join: {},
  },
  dto: {
    update: ProjectEntity,
    create: ProjectEntity,
  },
})
@Auth()
export class ProjectController implements CrudController<ProjectEntity> {
  constructor(public readonly service: ProjectService) {}

  @Post('custom/:id')
  @ApiOperation({
    summary: 'Custom data by Id',
  })
  async customData(@Param('id') id: number) {
    return await this.service.customData(id);
  }
}
