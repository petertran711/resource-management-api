import { Injectable } from '@nestjs/common';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { ProjectEntity } from '../../entities/project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { SkillService } from '../skill/skill.service';

@Injectable()
export class ProjectService extends TypeOrmCrudService<ProjectEntity> {
  constructor(
    @InjectRepository(ProjectEntity)
    public repo: Repository<ProjectEntity>,
    public userService: UserService,
    public skillService: SkillService,
  ) {
    super(repo);
  }

  async customData(id: number) {
    const project = await this.repo.findOne(id);

    return Promise.all(
      project?.member?.map(async (member) => {
        const users = await this.userService.repo.findOne({
          where: {
            id: member.userId,
          },
          relations: ['userPosition'],
        });
        const skills = await this.skillService.repo
          .find({
            where: {
              id: In(member.skillId || []),
            },
          })
          .then((res) => {
            let arr = [];
            arr.push(
              res.map((item) => {
                return item.name;
              }),
            );
            return arr.toString();
          });
        return {
          ...users,
          skill: skills,
          joinDate: member.joinDate,
          stopDate: member.stopDate,
        };
      }),
    );
  }
}
