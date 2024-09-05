import { BadRequestException, Injectable } from '@nestjs/common';
import { promisify } from 'util';
import { pipeline } from 'stream';
import { FastifyRequest } from 'fastify';
import * as CSVToJSON from 'csvtojson';
import { UserService } from '../user/user.service';
import { hash } from 'bcrypt';
import { ProjectService } from '../project/project.service';
import { StatusProject, TypeProject } from '../../entities/project.entity';
import { Location } from '../../entities/user.entity';
import { randomCodeNano } from '../../utils';
import { SkillService } from '../skill/skill.service';
import { In, Like } from 'typeorm';

const pump = promisify(pipeline);

@Injectable()
export class CdnService {
  constructor(
    public userService: UserService,
    public projectService: ProjectService,
    public skillService: SkillService,
  ) {}

  async uploadFile(req: FastifyRequest) {
    //Check request is multipart
    // @ts-ignore
    if (!req.isMultipart()) {
      throw new BadRequestException('Request is not multipart');
    }

    // @ts-ignore
    const parts = req.files();
    for await (const part of parts) {
      const jsonObj = await CSVToJSON().fromStream(part.file);
      if (jsonObj.length <= 0) return [];

      for (let i = 0; i < jsonObj.length; i++) {
        if (
          jsonObj[i].Name === '' ||
          jsonObj[i].Name === null ||
          jsonObj[i].Name === undefined
        )
          throw new BadRequestException(
            `Name dòng ${i + 1} không được để trống!`,
          );

        if (
          jsonObj[i].Account_Name === '' ||
          jsonObj[i].Account_Name === null ||
          jsonObj[i].Account_Name === undefined
        )
          throw new BadRequestException(
            `AccountName dòng ${i + 1} không được để trống!`,
          );

        if (
          jsonObj[i].Project === '' ||
          jsonObj[i].Project === null ||
          jsonObj[i].Project === undefined
        )
          throw new BadRequestException(
            `Project dòng ${i + 1} không được để trống!`,
          );

        if (
          jsonObj[i].Project_Start_Date === '' ||
          jsonObj[i].Project_Start_Date === null ||
          jsonObj[i].Project_Start_Date === undefined
        )
          throw new BadRequestException(
            `Project_Start_Date dòng ${i + 1} không được để trống!`,
          );

        if (
          jsonObj[i].Status === '' ||
          jsonObj[i].Status === null ||
          jsonObj[i].Status === undefined
        )
          throw new BadRequestException(
            `Status dòng ${i + 1} không được để trống!`,
          );

        if (
          jsonObj[i].Onboard === '' ||
          jsonObj[i].Onboard === null ||
          jsonObj[i].Onboard === undefined
        )
          throw new BadRequestException(
            `Onboard dòng ${i + 1} không được để trống!`,
          );

        if (
          jsonObj[i].Skill === '' ||
          jsonObj[i].Skill === null ||
          jsonObj[i].Skill === undefined
        )
          throw new BadRequestException(
            `Skill dòng ${i + 1} không được để trống!`,
          );

        const regex = /^\d{2}\/\d{2}\/\d{4}$/;

        if (jsonObj[i].Onboard.match(regex) === null) {
          throw new BadRequestException(
            `Onboard dòng ${i + 1} không đúng format dd/MM/yyyy!`,
          );
        }

        ///

        let userResponse;
        let location;
        switch (jsonObj[i].Location) {
          case 'Ha Noi':
            location = Location.HaNoi;
            break;
          case 'Ho Chi Minh':
            location = Location.HCM;
            break;
          case 'Da Nang':
            location = Location.DaNang;
            break;
        }

        let onboard = jsonObj[i].Onboard.split('/').reverse().join('-');
        let offboard = jsonObj[i].Offboard.split('/').reverse().join('-');
        let dob = jsonObj[i].Dob.split('/').reverse().join('-');

        const user = await this.userService.repo.findOne({
          accountName: jsonObj[i].Account_Name.toLowerCase(),
        });

        if (!user) {
          userResponse = await this.userService.repo.save({
            name: jsonObj[i].Name,
            accountName: jsonObj[i].Account_Name.toLowerCase(),
            email: jsonObj[i].Account_Name.toLowerCase(),
            password: await hash('123456aA@', 10),
            tel: '',
            location: location,
            onboardDate: onboard,
            leaveDate: offboard || null,
            note: jsonObj[i].Note,
            onsite: jsonObj[i].Onsite,
            dob: dob || null,
          });
        }

        ///
        let members = [];
        let projectResponse;
        let status;

        let typePrj =
          jsonObj[i].Project_Type.trim() === 'NON-GDC'
            ? TypeProject.NonGDC
            : TypeProject.GDC;

        switch (jsonObj[i].Status) {
          case 'In-Progress':
            status = StatusProject.InProgress;
            break;
          case 'Pool':
            status = StatusProject.Pool;
            break;
          case 'Pool-Delivery':
            status = StatusProject.Pool;
            break;
          case 'Pool(GDC)':
            status = StatusProject.Pool;
            break;
          case 'Complete':
            status = StatusProject.Complete;
            break;
        }

        let projectStartDate = jsonObj[i].Project_Start_Date.split('/')
          .reverse()
          .join('-');
        let projectEndDate = jsonObj[i]?.Project_End_Date.split('/')
          .reverse()
          .join('-');

        const project = await this.projectService.repo.findOne({
          code: jsonObj[i].Project_Code,
        });

        if (!project) {
          projectResponse = await this.projectService.repo.save({
            name: jsonObj[i].Project,
            typeProject: typePrj,
            pic: jsonObj[i].PIC,
            startDate: projectStartDate,
            endDate: projectEndDate || null,
            status: status,
            note: jsonObj[i].Note,
            code: randomCodeNano(),
          });
        }

        ///
        let skillResponse;

        const skill = await this.skillService.repo.findOne({
          name: Like(jsonObj[i].Skill),
        });

        if (!skill) {
          skillResponse = await this.skillService.repo.save({
            name: jsonObj[i].Skill,
          });
        }
        //cả 2 đã tồn tại || cả 2 mới tạo
        if (user && project) {
          if (project.member.length > 0) {
            // user tồn tại nhưng không tồn tại trong dự án
            if (!project.member.map((item) => item.userId).includes(user.id)) {
              members.push(...project.member, { userId: user.id });
              await this.projectService.repo
                .save({
                  ...project,
                  member: members,
                })
                .then((res) => {
                  res.member.map(async (mbSkill) => {
                    if (mbSkill.userId === user.id) {
                      mbSkill.skillId = [];
                      if (skill) mbSkill['skillId'].push(skill.id);
                      else mbSkill['skillId'].push(skillResponse.id);
                      await this.projectService.repo.save({
                        ...res,
                      });
                    }
                  });
                });
            } else {
              if (skill) {
                project.member.map(async (mbSkill) => {
                  if (mbSkill.userId === user.id) {
                    if (mbSkill.skillId && mbSkill.skillId.length > 0) {
                      const skillArr = await this.skillService.repo.find({
                        id: In(mbSkill.skillId),
                      });
                      if (
                        skillArr &&
                        !skillArr.map((item) => item.name).includes(skill.name)
                      ) {
                        mbSkill['skillId'].push(skill.id);
                        await this.projectService.repo.save({
                          ...project,
                        });
                      }
                    } else {
                      mbSkill.skillId = [];
                      mbSkill['skillId'].push(skill.id);
                      await this.projectService.repo.save({
                        ...project,
                      });
                    }
                  }
                });
              } else {
                project.member.map(async (mbSkill) => {
                  if (mbSkill.userId === user.id) {
                    if (!mbSkill.skillId && mbSkill.skillId.length === 0) {
                      mbSkill.skillId = [];
                    }
                    mbSkill['skillId'].push(skillResponse.id);
                    await this.projectService.repo.save({
                      ...project,
                    });
                  }
                });
              }
            }
          } else {
            const member = {
              userId: null,
              skillId: [],
            };
            member.userId = user.id;
            if (skill) member.skillId.push(skill.id);
            else member.skillId.push(skillResponse.id);

            members.push(member);
            await this.projectService.repo.save({
              ...project,
              member: members,
            });
          }
        } else if (!user && !project) {
          const member = {
            userId: null,
            skillId: [],
          };
          member.userId = userResponse.id;
          if (skill) member.skillId.push(skill.id);
          else member.skillId.push(skillResponse.id);

          members.push(member);
          await this.projectService.repo.save({
            ...projectResponse,
            member: members,
          });
        }

        //1 trong 2 thg có
        if (user && !project) {
          const member = {
            userId: null,
            skillId: [],
          };
          member.userId = user.id;
          if (skill) member.skillId.push(skill.id);
          else member.skillId.push(skillResponse.id);

          members.push(member);
          await this.projectService.repo.save({
            ...projectResponse,
            member: members,
          });
        } else if (!user && project) {
          if (project.member.length > 0) {
            if (
              !project.member
                .map((item) => item.userId)
                .includes(userResponse.id)
            ) {
              members.push(...project.member, { userId: userResponse.id });
              await this.projectService.repo
                .save({
                  ...project,
                  member: members,
                })
                .then((res) => {
                  res.member.map(async (mbSkill) => {
                    if (mbSkill.userId === userResponse.id) {
                      mbSkill.skillId = [];
                      if (skill) mbSkill['skillId'].push(skill.id);
                      else mbSkill['skillId'].push(skillResponse.id);
                      await this.projectService.repo.save({
                        ...res,
                      });
                    }
                  });
                });
            }
          } else {
            const member = {
              userId: null,
              skillId: [],
            };
            member.userId = userResponse.id;
            if (skill) member.skillId.push(skill.id);
            else member.skillId.push(skillResponse.id);

            members.push(member);
            await this.projectService.repo.save({
              ...project,
              member: members,
            });
          }
        }
      }
    }
    return Promise.resolve('OK');
  }
}
