import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../modules/auth/guard/jwt-auth.guard';
import { ACLGuard } from '../modules/auth/guard/acl.guard';

export function Auth() {
  return applyDecorators(ApiBearerAuth(), UseGuards(JwtAuthGuard, ACLGuard));
}
