import { ApiProperty } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export class BadRequestErrorApiResponseDto {
  @ApiProperty({ example: HttpStatus.BAD_REQUEST })
  statusCode: number;

  @ApiProperty({ example: ['Data is not valid 1', 'Data is not valid 2'] })
  message: string[];

  @ApiProperty({ example: 'Bad Request' })
  error: string;
}
