import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { UserModule } from '../user/user.module';
import { ProjectModule } from '../project/project.module';

@Module({
  controllers: [DashboardController],
  providers: [DashboardService],
  imports: [UserModule, ProjectModule],
})
export class DashboardModule {}
