import { UserService } from './user.service';
import { UserStatus, UserEntity } from '../../entities/user.entity';
import {
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@nestjsx/crud';
import { Crud } from '../../constant/crud.decorator';
import {
  BadRequestException,
  Body,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { compare } from 'bcrypt';
import { SwitchAuthenDto } from './dto/switch-authen.dto';
import { Auth } from '../../constant/auth.decorator';

@Crud({
  name: 'Người dùng',
  controller: 'users',
  model: {
    type: UserEntity,
  },
  query: {
    exclude: ['password'],
    join: {
      userPosition: {},
      'userPosition.skills': {},
    },
  },
  dto: {
    create: UserEntity,
  },
})
@Auth()
export class UserController implements CrudController<UserEntity> {
  constructor(public readonly service: UserService) {}

  get base(): CrudController<UserEntity> {
    return this;
  }

  @Override()
  async updateOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: UserEntity,
  ): Promise<any> {
    const userPass = await this.service.repo.findOne({
      where: {
        id: dto.id,
      },
      select: ['password'],
    });
    if (userPass) {
      if (dto.password) {
        const samePassword = await compare(dto.password, userPass.password);
        if (!samePassword)
          throw new BadRequestException(
            'Mật khẩu không đúng. Vui lòng thử lại!',
          );
      }
      if (dto.password === '') {
        const { password, ...payload } = dto;
        return await this.base.updateOneBase(
          req,
          payload as unknown as UserEntity,
        );
      }
    } else throw new BadRequestException('User không tồn tại!');

    // @ts-ignore
    if (dto.newPass) {
      const re = new RegExp(
        /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=(.*[!@#$%^&*()\-__+.]){1,})(?=.*[a-z]).*$/,
      );
      // @ts-ignore
      if (!re.test(dto.newPass))
        throw new BadRequestException(
          'Mật khẩu mới của bạn cần có ít nhất 1 ký tự đặc biệt, 1 chữ hoa, 1 chữ thường và 1 số!',
        );
      // @ts-ignore
      dto.password = dto.newPass;
    }

    return await this.base.updateOneBase(req, dto as unknown as UserEntity);
  }

  @Override()
  async deleteOne(
    @ParsedRequest() req: CrudRequest,
    @Param('id') id: number,
  ): Promise<any> {
    const user = await this.service.repo.findOne(id);
    if (user.status !== UserStatus.Inactive) user.status = UserStatus.Inactive;
    else user.status = UserStatus.Active;
    return await this.base.updateOneBase(req, user as unknown as UserEntity);
  }

  @Override()
  async createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: UserEntity,
  ): Promise<any> {
    const user = await this.service.repo.findOne({
      email: dto.email,
    });
    if (user) {
      throw new BadRequestException('Email đã tồn tại, Vui lòng thử lại!');
    }
    return await this.base.updateOneBase(req, {
      ...dto,
      accountName: dto.email.toLowerCase(),
    } as unknown as UserEntity);
  }

  @Post('switch-security')
  @ApiOperation({
    summary: 'Switch 2fAuthentication for user',
  })
  @HttpCode(200)
  async switchTwoFactorAuthentication(@Body() dto: SwitchAuthenDto) {
    return await this.service.switchTwoFactorAuthentication(dto);
  }
}
