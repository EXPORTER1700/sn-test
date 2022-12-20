import { ApiProperty } from '@nestjs/swagger';
import { IsString, ValidateIf } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({ example: 'test' })
  @IsString()
  @ValidateIf((object, value) => value !== null)
  firstName: string | null;

  @ApiProperty({ example: 'test' })
  @IsString()
  @ValidateIf((object, value) => value !== null)
  lastName: string | null;

  @ApiProperty({ example: 'url.to.image' })
  @IsString()
  @ValidateIf((object, value) => value !== null)
  photo: string | null;
}
