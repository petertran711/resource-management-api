import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * Decorator dùng để lấy thông tin User đã đăng nhập
 */
export const User = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    return req.user;
  },
);
