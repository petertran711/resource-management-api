import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, Matches, MaxLength, MinLength } from 'class-validator';
import { hash } from 'bcrypt';
import { UserPositionEntity } from './user-position.entity';
import { RoleEntity } from './role.entity';

export enum Gender {
  Male = 'male',
  Female = 'female',
}

export enum Role {
  Admin = 'admin',
  User = 'user',
}

export enum UserStatus {
  Active = 'active',
  Inactive = 'inactive',
  Waiting = 'waiting',
  Pool = 'pool',
}

export enum Location {
  HaNoi = 'hanoi',
  HCM = 'hcm',
  DaNang = 'danang',
}

@Entity('user')
export class UserEntity extends BaseEntity {
  @Column()
  @ApiProperty({
    description: 'Tên',
    // type: String,
    type: () => String,
  })
  name: string;

  @Column()
  @ApiProperty({
    description: 'Tên account',
    // type: String,
    type: () => String,
  })
  accountName: string;

  @Column()
  @ApiProperty({
    description: 'Email',
    type: String,
  })
  email: string;

  @Column()
  @ApiProperty({
    description: 'Số điện thoại',
    type: String,
  })
  tel: string;

  @IsOptional()
  @ApiProperty({
    description: 'Giới tính',
    required: false,
    enum: Gender,
  })
  @Column({
    type: 'enum',
    enum: Gender,
    nullable: true,
  })
  gender?: Gender;

  @ApiProperty({
    description: 'Mật khẩu',
  })
  @Column({
    select: false,
  })
  @MinLength(8, { message: 'Mật khẩu cần có độ dài >= 8 ký tự!' })
  @MaxLength(20, { message: 'Mật khẩu cần có độ dài =< 20 ký tự!' })
  @Matches(
    /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=(.*[!@#$%^&*()\-__+.]){1,})(?=.*[a-z]).*$/,
    {
      message:
        'Mật khẩu của bạn cần có ít nhất 1 ký tự đặc biệt, 1 chữ hoa, 1 chữ thường và 1 số!',
    },
  )
  password: string;

  @Column({
    nullable: true,
    default: 2,
  })
  @ApiProperty({
    description: 'Role ID',
    required: false,
    default: 2,
  })
  roleId?: number;

  @ManyToOne(() => RoleEntity, (role) => role.users, {
    nullable: true,
  })
  role?: RoleEntity;

  @IsOptional()
  @ApiProperty({
    description: 'Thời gian nghỉ việc',
    type: Date,
    required: false,
  })
  @Column({
    type: Date,
    nullable: true,
  })
  leaveDate?: Date;

  @IsOptional()
  @ApiProperty({
    description: 'Thời gian onboard',
    type: Date,
    required: false,
  })
  @Column({
    type: Date,
    nullable: true,
  })
  onboardDate?: Date;

  @IsOptional()
  @Column({
    nullable: true,
  })
  @ApiProperty({
    description: 'Địa chỉ',
    type: String,
    required: false,
  })
  address?: string;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.Pool,
  })
  @ApiProperty({
    description: 'Trạng thái',
    enum: UserStatus,
  })
  status: UserStatus;

  @IsOptional()
  @Column({
    nullable: true,
  })
  @ApiProperty({
    description: 'Ảnh',
    type: String,
    required: false,
  })
  avatar?: string;

  @IsOptional()
  @Column({
    nullable: true,
  })
  @ApiProperty({
    description: 'Ghi chú',
    type: String,
    required: false,
  })
  note?: string;

  @IsOptional()
  @Column({
    nullable: true,
  })
  @ApiProperty({
    description: 'Có onsite không?',
    type: String,
    required: false,
  })
  onsite?: string;

  @IsOptional()
  @Column({
    nullable: true,
    type: 'enum',
    enum: Location,
  })
  @ApiProperty({
    description: 'Địa điểm làm việc?',
    enum: Location,
    required: false,
  })
  location?: Location;

  @IsOptional()
  @ApiProperty({
    description: 'Ngày sinh',
    type: Date,
    required: false,
  })
  @Column({
    type: Date,
    nullable: true,
  })
  dob?: Date;

  @Column({
    nullable: true,
  })
  @ApiProperty({
    description: 'Id vị trí',
    required: false,
  })
  userPositionId?: number;

  @ManyToOne(() => UserPositionEntity, (userPosition) => userPosition.id, {
    onDelete: 'SET NULL',
  })
  userPosition?: UserPositionEntity;

  @ApiProperty({
    description: 'twoFactorAuthenticationSecret',
    required: false,
  })
  @Column({
    nullable: true,
  })
  twoFactorAuthenticationSecret?: string;

  @ApiProperty({
    description: 'isTwoFactorAuthenticationEnabled',
    required: false,
  })
  @Column({ default: false, nullable: true })
  isTwoFactorAuthenticationEnabled?: boolean;

  @BeforeUpdate()
  @BeforeInsert()
  async hashPassword() {
    if (this.password) this.password = await hash(this.password, 10);
  }
}
