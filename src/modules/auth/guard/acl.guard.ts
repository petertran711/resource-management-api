import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { PATH_METADATA } from '@nestjs/common/constants';

@Injectable()
export class ACLGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const request = ctx.switchToHttp().getRequest();
    if (request?.user?.roleId === 1) return true;
    const handler = ctx.getHandler();
    const controller = ctx.getClass();

    const controllerPath = Reflect.getMetadata(PATH_METADATA, controller);
    const crudHandler = [
      'createOneBase',
      'getOneBase',
      'deleteOneBase',
      'getManyBase',
      'updateOneBase',
    ];
    const needAddBaseSuffix = [
      'createOne',
      'getOne',
      'deleteOne',
      'getMany',
      'updateOne',
    ];
    let permission = controllerPath + '_';
    if (needAddBaseSuffix.includes(handler.name))
      permission += handler.name + 'Base';
    else if (crudHandler.includes(handler.name)) permission += handler.name;
    else permission += controller.name + '_' + handler.name;
    return !!request?.user?.role?.permissions?.includes(permission);
  }
}
