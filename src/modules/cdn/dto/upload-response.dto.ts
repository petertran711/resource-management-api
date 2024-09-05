import { ApiProperty } from '@nestjs/swagger';

export class UploadResponseDto {
  @ApiProperty({
    description: 'Tên file đã uploads',
    type: [String],
  })
  files: string[];
}
