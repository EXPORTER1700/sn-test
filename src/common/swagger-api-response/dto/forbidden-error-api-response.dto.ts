import { ApiProperty } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export class ForbiddenErrorApiResponseDto {
  @ApiProperty({ example: HttpStatus.FORBIDDEN })
  statusCode: number;

  @ApiProperty({ example: 'It is forbidden to do this' })
  message: string | string[];

  @ApiProperty({ example: 'FORBIDDEN' })
  error: string;
}
