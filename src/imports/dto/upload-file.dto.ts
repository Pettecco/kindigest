import { ApiProperty } from '@nestjs/swagger';

export class UploadImportResponseDto {
  @ApiProperty({
    description: 'ID of the created import. Processing happens asynchronously.',
    example: 'f68873b4-933f-4d04-bc3c-4f88713c7077',
  })
  importId: string;
}
