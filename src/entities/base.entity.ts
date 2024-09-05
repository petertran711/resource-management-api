import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export class BaseEntity {
  @ApiProperty({
    description: 'ID',
    required: false,
  })
  @PrimaryGeneratedColumn()
  id?: number;

  @ApiProperty({
    description: 'Thời gian tạo',
    required: false,
  })
  @CreateDateColumn({
    type: 'timestamp with time zone',
  })
  createdAt?: Date;

  @ApiProperty({
    description: 'Thời gian cập nhật',
    required: false,
  })
  @UpdateDateColumn({
    type: 'timestamp with time zone',
  })
  updatedAt?: Date;

  @ApiProperty({
    description: 'Thời gian xoá',
    required: false,
  })
  @DeleteDateColumn({
    type: 'timestamp with time zone',
  })
  deletedAt?: Date;
}
