import { ApiProperty } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export class UnprocessableErrorApiResponseDto {
  @ApiProperty({ example: HttpStatus.UNPROCESSABLE_ENTITY })
  statusCode: number;

  @ApiProperty({ example: 'Data is not valid' })
  message: string | string[];

  @ApiProperty({ example: 'Unprocessable Entity' })
  error: string;
}
