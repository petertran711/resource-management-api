import { Inject, Injectable } from '@nestjs/common';
import { addHours, endOfMonth, startOfMonth } from 'date-fns';
import { UserService } from '../user/user.service';
import { UserStatus } from '../../entities/user.entity';
import { ProjectService } from '../project/project.service';
import { Between } from 'typeorm';
import { StatusProject } from '../../entities/project.entity';

@Injectable()
export class DashboardService {
  constructor(
    @Inject(UserService)
    public userService: UserService,
    @Inject(ProjectService)
    public projectService: ProjectService,
  ) {}
  async byMonth(month: string) {
    const startDateOfMonth = addHours(startOfMonth(new Date(month)), 7);
    const endDateOfMonth = addHours(endOfMonth(new Date(month)), 7);
    const totalUserPool = await this.userService.repo.count({
      where: {
        createdAt: Between(startDateOfMonth, endDateOfMonth),
        status: UserStatus.Pool,
      },
    });
    const totalProject = await this.projectService.repo.count({
      where: {
        createdAt: Between(startDateOfMonth, endDateOfMonth),
      },
    });
    const totalProcessProject = await this.projectService.repo.count({
      where: {
        createdAt: Between(startDateOfMonth, endDateOfMonth),
        status: StatusProject.InProgress,
      },
    });
    return {
      totalUserPool,
      totalProject,
      totalProcessProject,
    };
  }
  async byYear(year: string) {
    return 0;
  }
}
