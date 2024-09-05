import { Column, Entity, OneToMany } from 'typeorm';
import { UserEntity } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';
import {BaseEntity} from "./base.entity";

@Entity('role')
export class RoleEntity extends BaseEntity {
  @ApiProperty({
    description: 'Tên nhóm',
  })
  @Column()
  name: string;

  @ApiProperty({
    description: 'Quyền',
  })
  @Column({
    type: 'jsonb',
    default: [],
  })
  permissions: string[];

  @OneToMany(() => UserEntity, (user) => user.role)
  public users: UserEntity[];
}
