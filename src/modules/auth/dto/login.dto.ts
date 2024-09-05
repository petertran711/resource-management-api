import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsString()
  @ApiProperty({
    description: 'Email',
  })
  email: string;

  @IsString()
  @ApiProperty({
    description: 'Mật khẩu',
  })
  password: string;
}
