import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { CrudConfigService } from '@nestjsx/crud';
import fastify_multipart from '@fastify/multipart';

CrudConfigService.load({
  query: {
    limit: 10,
    maxLimit: 100,
    cache: 2000,
    alwaysPaginate: true,
  },
});
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { cors: true },
  );

  await app.register(fastify_multipart, {
    limits: {
      fieldNameSize: 100, // Max field name size in bytes
      fieldSize: 100, // Max field value size in bytes
      fields: 10, // Max number of non-file fields
      fileSize: 5000000, // For multipart forms, the max file size in bytes
      files: 10, // Max number of file fields
      headerPairs: 2000, // Max number of header key=>value pairs
    },
  });

  const options = new DocumentBuilder()
    .setTitle('Management DU19')
    .setDescription('Management DU19')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT || 4000, '0.0.0.0');
  console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
