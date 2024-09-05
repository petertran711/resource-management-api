import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { UserDecoded } from '../../interfaces';
import { UserEntity, UserStatus } from '../../entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { RegisterDto } from './dto/register.dto';
import { authenticator } from 'otplib';
import { toDataURL } from 'qrcode';
import { ResetPassDto } from './dto/resetPass.dto';

@Injectable()
export class AuthService {
  constructor(
    public userService: UserService,
    public jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async validate(payload: UserDecoded) {
    const user = await this.userService.repo.findOne(payload.sub, {
      relations: ['role'],
    });
    if ([UserStatus.Inactive].includes(user?.status)) return false;
    return user;
  }

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.repo.findOne({
      where: {
        email: email,
      },
      select: ['password', 'tel', 'name', 'id', 'email', 'roleId', 'status'],
      relations: ['role'],
    });
    if (user) {
      const samePassword = await compare(pass, user.password);
      if (!samePassword)
        throw new BadRequestException('Mật khẩu không đúng. Vui lòng thử lại!');
    } else
      throw new BadRequestException('Email không tồn tại. Vui lòng thử lại!');

    return {
      tel: user.tel,
      fullName: user.name,
      sub: user.id,
      email: user.email,
      roleId: user?.roleId,
      isTwoFactorAuthenticationEnabled: user.isTwoFactorAuthenticationEnabled,
      permissions: user?.role?.permissions || [],
      status: user.status,
    };
  }

  async login(user: any) {
    return this.jwtService.sign(user);
  }

  async register(dto: RegisterDto) {
    const existUser = await this.userService.repo.findOne({
      where: [{ email: dto.email }, { accountName: dto.email }],
    });

    if (!existUser) {
      const user = new UserEntity();
      user.password = dto.password;
      user.name = dto.name;
      user.tel = dto.tel;
      user.email = dto.email;
      user.accountName = dto.email;
      return await this.userService.repo.save(user);
    } else
      throw new BadRequestException('User đã được đăng ký. Vui lòng thử lại');
  }

  public async generateTwoFactorAuthenticationSecret(user: UserEntity) {
    let secret = authenticator.generateSecret();

    if (user.isTwoFactorAuthenticationEnabled)
      secret = user.twoFactorAuthenticationSecret;

    const otpAuthUrl = authenticator.keyuri(
      user.email,
      'DAT_AUTHENTICATION',
      secret,
    );

    await this.userService.setTwoFactorAuthenticationSecret(secret, user.id);

    return {
      secret,
      otpAuthUrl,
    };
  }

  public async pipeQrCode(otpAuthUrl: string) {
    return toDataURL(otpAuthUrl);
  }

  public isTwoFactorAuthenticationCodeValid(
    twoFactorAuthenticationCode: string,
    user: UserEntity,
  ) {
    return authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret: user.twoFactorAuthenticationSecret ?? '',
    });
  }

  async resetPassword(dto: ResetPassDto) {
    const user = await this.userService.repo.findOne({
      where: [{ email: dto.email }, { accountName: dto.email }],
    });
    if (!user) throw new BadRequestException('Lỗi hệ thống .Vui lòng thử lại');
    user.password = dto.password;
    await this.userService.repo.save(user);

    return Promise.resolve({
      message: 'OK',
    });
  }
}
