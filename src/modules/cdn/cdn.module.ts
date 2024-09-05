import { Module } from '@nestjs/common';
import { CdnService } from './cdn.service';
import { CdnController } from './cdn.controller';
import { UserModule } from '../user/user.module';
import { ProjectModule } from '../project/project.module';
import { SkillModule } from '../skill/skill.module';

@Module({
  controllers: [CdnController],
  providers: [CdnService],
  imports: [UserModule, ProjectModule, SkillModule],
})
export class CdnModule {}
