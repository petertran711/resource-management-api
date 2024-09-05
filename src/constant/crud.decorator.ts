import { applyDecorators, Controller } from '@nestjs/common';
import { Crud as CrudController } from '@nestjsx/crud';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CrudOptions } from '@nestjsx/crud/lib/interfaces';
import { capitalizeFirstLetter } from "../utils";
const deepmerge = require('deepmerge');

interface Options extends CrudOptions {
  /* Tên controller, dùng cho path */
  controller: string;
  /* Tên của Models, routes */
  name?: string;
}

export function Crud(options: Options) {
  let entityName = options?.name;
  if (!entityName) entityName = options.model.type.name;
  const newOptions: CrudOptions = deepmerge(options, {
    model: {
      type: options.model.type,
    },
    routes: {
      exclude: ['createManyBase', 'replaceOneBase'],
      getManyBase: {
        decorators: [
          ApiOperation({
            operationId: 'getManyBase',
            summary: `Danh sách ${entityName}`,
          }),
        ],
      },
      getOneBase: {
        decorators: [
          ApiOperation({
            operationId: 'getOneBase',
            summary: `Chi tiết ${entityName}`,
          }),
        ],
      },
      updateOneBase: {
        decorators: [
          ApiOperation({
            operationId: 'updateOneBase',
            summary: `Sửa ${entityName}`,
          }),
        ],
      },
      deleteOneBase: {
        decorators: [
          ApiOperation({
            operationId: 'deleteOneBase',
            summary: `Xoá ${entityName}`,
          }),
        ],
      },
      createManyBase: {
        decorators: [
          ApiOperation({
            operationId: 'createManyBase',
            summary: `Thêm nhiều ${entityName}`,
          }),
        ],
      },
      createOneBase: {
        decorators: [
          ApiOperation({
            operationId: 'createOneBase',
            summary: `Thêm ${entityName}`,
          }),
        ],
      },
    },
  });
  return applyDecorators(
    CrudController(newOptions),
    ApiTags(capitalizeFirstLetter(options.controller)),
    Controller(options.controller),
  );
}
