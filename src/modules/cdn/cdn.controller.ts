import { Controller, Post, Req } from '@nestjs/common';
import { CdnService } from './cdn.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FastifyRequest } from 'fastify';

@ApiTags('CDN')
@Controller('cdn')
export class CdnController {
  constructor(private readonly service: CdnService) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOperation({
    summary: 'Upload file User/Project',
  })
  async uploadFile(@Req() req: FastifyRequest): Promise<any> {
    return await this.service.uploadFile(req);
  }
}
