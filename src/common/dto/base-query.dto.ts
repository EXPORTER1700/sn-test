import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class BaseQueryDto {
  @ApiProperty({ example: 6 })
  @IsNumber()
  limit: number;

  @ApiProperty({ example: 0 })
  @IsNumber()
  offset: number;
}
