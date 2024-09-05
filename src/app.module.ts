import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getMetadataArgsStorage } from 'typeorm';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { CdnModule } from './modules/cdn/cdn.module';
import { join } from 'path';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { UserPositionModule } from './modules/user-position/user-position.module';
import { ProjectModule } from './modules/project/project.module';
import { SkillModule } from './modules/skill/skill.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { RoleModule } from './modules/role/role.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['config/.env', 'config/ormconfig.env'],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get<string>('TYPEORM_HOST'),
          port: configService.get<number>('TYPEORM_PORT'),
          username: configService.get<string>('TYPEORM_USERNAME'),
          password: configService.get<string>('TYPEORM_PASSWORD'),
          database: configService.get<string>('TYPEORM_DATABASE'),
          entities: getMetadataArgsStorage().tables.map((tbl) => tbl.target),
          synchronize: true,
          migrationsRun: false,
          // logging: true,
        };
      },
    }),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: 'nguyenmanhdat24051998@gmail.com',
            pass: 'njlzyjyxxomrpirj',
          },
        },
        // defaults: {
        //   from: '"No Reply" <noreply@example.com>',
        // },
        template: {
          dir: join(__dirname, 'templates/'),
          adapter: new PugAdapter(), // or new PugAdapter() or new EjsAdapter()
          options: {
            strict: true,
          },
        },
      }),
    }),

    UserModule,
    AuthModule,
    CdnModule,
    UserPositionModule,
    ProjectModule,
    SkillModule,
    DashboardModule,
    RoleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
