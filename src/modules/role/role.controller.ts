import { Body, Get, Post } from '@nestjs/common';
import { ApiBody, ApiOperation } from '@nestjs/swagger';
import {
  CrudController,
  CrudRequest,
  Override,
  ParsedRequest,
} from '@nestjsx/crud';
import { GetManyDefaultResponse } from '@nestjsx/crud/lib/interfaces';
import { lastValueFrom } from 'rxjs';
import { RoleService } from './role.service';
import { Crud } from '../../constant/crud.decorator';
import { Auth } from '../../constant/auth.decorator';
import { HttpService } from '@nestjs/axios';
import { RoleEntity } from '../../entities/role.entity';

@Crud({
  controller: 'roles',
  name: 'Role',
  model: {
    type: RoleEntity,
  },
})
@Auth()
export class RoleController implements CrudController<RoleEntity> {
  constructor(
    public readonly service: RoleService,
    private httpService: HttpService,
  ) {}

  ignoreControllers = [
    'controller',
    'roles',
    'permissions',
    'provinces',
    'districts',
    'wards',
  ];

  get base(): CrudController<RoleEntity> {
    return this;
  }

  @Override()
  getMany(
    @ParsedRequest() req: CrudRequest,
  ): Promise<GetManyDefaultResponse<RoleEntity> | RoleEntity[]> {
    return this.base.getManyBase(req);
  }

  @Get('/routes')
  @ApiOperation({
    summary: 'Danh sách chức năng',
  })
  async routes() {
    const docs = await lastValueFrom(
      this.httpService.get('http://127.0.0.1:4000/docs-json'),
    );
    const paths = {};
    Object.keys(docs.data.paths).map((key) => {
      const keys = key.split('/');
      const controller = keys[1];
      Object.keys(docs.data.paths[key]).map((method) => {
        if (
          docs.data.paths[key][method]?.security?.length > 0 &&
          !this.ignoreControllers.includes(controller)
        )
          paths[controller] = {
            ...paths[controller],
            ...{
              [docs.data.paths[key][method].operationId]:
                docs.data.paths[key][method].summary,
            },
          };
      });
    });
    return paths;
  }

  @Post('bulk')
  @ApiOperation({
    summary: 'Cập nhật nhiều nhóm Quyền',
  })
  @ApiBody({
    type: [RoleEntity],
  })
  async updateMany(@Body() dto: RoleEntity[]) {
    return this.service.updateMany(dto);
  }
}
