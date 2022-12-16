import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class BaseQueryDto {
  @ApiProperty({ example: 6 })
  limit: number;

  @ApiProperty({ example: 0 })
  offset: number;
}
