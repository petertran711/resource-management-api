import { BeforeInsert, Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserPositionEntity } from './user-position.entity';
import { UserEntity } from './user.entity';
import { SkillEntity } from './skill.entity';
import { randomCodeNano } from '../utils';

export enum TypeProject {
  GDC = 'gdc',
  NonGDC = 'nonGDC',
}

export enum StatusProject {
  Complete = 'complete',
  InProgress = 'inProgress',
  Pool = 'pool',
}

export class MemberProject {
  @Column()
  @ApiProperty({
    description: 'Tên thành viên',
    type: String,
  })
  userId: number;

  @OneToMany(() => UserEntity, (user) => user.id)
  user?: UserEntity;

  @IsOptional()
  @Column({
    nullable: true,
  })
  @ApiProperty({
    description: 'Vị trí thành viên',
    type: String,
    required: false,
  })
  userPositionId?: number;

  @OneToMany(() => UserPositionEntity, (userPosition) => userPosition.id)
  userPosition?: UserPositionEntity;

  @IsOptional()
  @ApiProperty({
    description: 'Ngày tham gia',
    type: Date,
    required: false,
  })
  @Column({
    type: Date,
    nullable: true,
  })
  joinDate?: Date;

  @IsOptional()
  @ApiProperty({
    description: 'Ngày ngừng tham gia',
    type: Date,
    required: false,
  })
  @Column({
    type: Date,
    nullable: true,
  })
  stopDate?: Date;

  @IsOptional()
  @Column({ type: 'jsonb', nullable: true })
  @ApiProperty({
    description: 'Id kỹ năng',
    required: false,
    type: [Number],
  })
  skillId?: number[];

  @OneToMany(() => SkillEntity, (skill) => skill.id)
  skill?: SkillEntity[];
}

@Entity('project')
export class ProjectEntity extends BaseEntity {
  @IsString()
  @Column()
  @ApiProperty({
    description: 'Tên',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'Loại dự án',
    enum: TypeProject,
  })
  @Column({
    type: 'enum',
    enum: TypeProject,
    default: TypeProject.GDC,
  })
  typeProject: TypeProject;

  @IsString()
  @IsOptional()
  @Column({
    type: String,
    nullable: true,
  })
  @ApiProperty({
    description: 'PIC',
    type: String,
    required: false,
  })
  pic?: string;

  @ApiProperty({
    description: 'Ngày bắt đầu',
    type: Date,
  })
  @Column({
    type: Date,
  })
  startDate: Date;

  @IsOptional()
  @ApiProperty({
    description: 'Ngày kết thúc',
    type: Date,
    required: false,
  })
  @Column({
    type: Date,
    nullable: true,
  })
  endDate?: Date;

  @Column({
    type: 'enum',
    enum: StatusProject,
    default: StatusProject.InProgress,
  })
  @ApiProperty({
    description: 'Trạng thái',
    enum: StatusProject,
  })
  status: StatusProject;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Ghi chú',
    required: false,
  })
  @Column({
    nullable: true,
    type: String,
  })
  note?: string;

  @IsOptional()
  @ApiProperty({
    description: 'Thành viên',
    required: false,
    type: [MemberProject],
  })
  @Column({
    nullable: true,
    type: 'jsonb',
  })
  member?: MemberProject[];

  @IsOptional()
  @Column({
    nullable: true,
  })
  @ApiProperty({
    description: 'Mã tự random',
    required: false,
    type: String,
  })
  code?: string;

  @BeforeInsert()
  async random() {
    this.code = randomCodeNano();
  }
}
