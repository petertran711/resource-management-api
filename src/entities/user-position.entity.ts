import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { SkillEntity } from './skill.entity';
import { UserEntity } from './user.entity';
import { IsOptional } from 'class-validator';

export enum Experience {
  SE01 = 'se01',
  SE02 = 'se02',
  SE03 = 'se03',
  SE04 = 'se04',
  SE05 = 'se05',
}
@Entity('user-position')
export class UserPositionEntity extends BaseEntity {
  @Column()
  @ApiProperty({
    description: 'Tên vị trí',
    type: String,
  })
  name: string;

  @IsOptional()
  @Column({
    type: 'enum',
    enum: Experience,
    nullable: true,
  })
  @ApiProperty({
    description: 'Kinh nghiệm',
    enum: Experience,
    required: false,
  })
  experience?: Experience;

  @OneToMany(() => UserEntity, (user) => user.userPosition)
  users: UserEntity[];

  @OneToMany(() => SkillEntity, (skill) => skill.userPosition)
  skills: SkillEntity[];
}
