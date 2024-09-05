import { Module } from '@nestjs/common';
import { UserPositionService } from './user-position.service';
import { UserPositionController } from './user-position.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPositionEntity } from '../../entities/user-position.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserPositionEntity])],
  controllers: [UserPositionController],
  providers: [UserPositionService],
  exports: [UserPositionService],
})
export class UserPositionModule {}
