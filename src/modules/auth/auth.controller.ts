import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { LoginDto } from './dto/login.dto';
import { UserEntity } from '../../entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { UserService } from '../user/user.service';
import { twofactorAuthenDto } from './dto/2fAuthen.dto';
import { ResetPassDto } from './dto/resetPass.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly service: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({
    summary: 'Đăng nhập bằng SĐT/Password',
  })
  @ApiBody({
    type: LoginDto,
  })
  async login(@Req() req) {
    return await this.service.login(req.user);
  }

  @Post('register')
  @ApiOperation({
    summary: 'Đăng ký tài khoản',
  })
  @ApiBody({
    type: RegisterDto,
  })
  @ApiOkResponse({
    type: UserEntity,
  })
  async register(@Body() dto: RegisterDto) {
    return await this.service.register(dto);
  }

  @Post('generate/:email')
  @ApiOperation({
    summary: 'Generate QRCode',
  })
  async generateQRCode(@Res() response, @Param('email') email: string) {
    const user = await this.userService.repo.findOne({
      where: [{ email: email }, { accountName: email }],
    });
    if (!user)
      throw new BadRequestException('User không tồn tại. Vui lòng đăng ký');

    const { otpAuthUrl } =
      await this.service.generateTwoFactorAuthenticationSecret(user);
    const dataQRCode = await this.service.pipeQrCode(otpAuthUrl);
    return response.send(dataQRCode);
  }

  @Post('turn-on')
  @ApiOperation({
    summary: 'Turn on 2fAuthentication',
  })
  @HttpCode(200)
  async turnOnTwoFactorAuthentication(@Body() dto: twofactorAuthenDto) {
    const user = await this.userService.repo.findOne({
      where: [{ email: dto.email }, { accountName: dto.email }],
    });
    const isCodeValid = this.service.isTwoFactorAuthenticationCodeValid(
      dto.twoFactorAuthenticationCode,
      user,
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Wrong authentication code');
    }
    return await this.userService.turnOnTwoFactorAuthentication(user.id);
  }

  @Post('checkEmail/:email')
  @ApiOperation({
    summary: 'Kiểm tra Email',
  })
  async checkEmail(@Param('email') email: string) {
    const user = await this.userService.repo.findOne({
      where: [{ email: email }, { accountName: email }],
    });
    if (!user)
      throw new BadRequestException(
        'Email không tồn tại trên hệ thống. Vui lòng đăng ký',
      );
    let str;
    if (user.isTwoFactorAuthenticationEnabled) str = '/otp';
    else str = '/qrcode';
    return str;
  }

  @Post('resetPassword')
  @ApiOperation({
    summary: 'Reset Password',
  })
  async resetPassword(@Body() dto: ResetPassDto) {
    return await this.service.resetPassword(dto);
  }
}
