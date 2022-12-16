import { ApiProperty } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export class InternalServerErrorApiResponseDto {
  @ApiProperty({ example: HttpStatus.INTERNAL_SERVER_ERROR })
  statusCode: number;

  @ApiProperty({ example: 'There was an error on the server side' })
  message: string | string[];

  @ApiProperty({ example: 'Internal Server Error' })
  error: string;
}
