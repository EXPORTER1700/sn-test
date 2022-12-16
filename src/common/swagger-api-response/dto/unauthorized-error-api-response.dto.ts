import { ApiProperty } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export class UnauthorizedErrorApiResponseDto {
  @ApiProperty({ example: HttpStatus.UNAUTHORIZED })
  statusCode: number;

  @ApiProperty({ example: 'Unauthorized' })
  message: string[];

  @ApiProperty({ example: 'Unauthorized' })
  error: string;
}
