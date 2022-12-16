import { ApiProperty } from '@nestjs/swagger';

export class BaseQueryDto {
  @ApiProperty({ example: 6 })
  limit: number;

  @ApiProperty({ example: 0 })
  offset: number;
}
