import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { UserPositionEntity } from './user-position.entity';

@Entity('skill')
export class SkillEntity extends BaseEntity {
  @Column()
  @ApiProperty({
    description: 'Tên kỹ năng',
    type: String,
  })
  name: string;

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
  userPosition: UserPositionEntity;
}
