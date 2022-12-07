import { IsString, MaxLength, ValidateIf } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @MaxLength(24)
  @ValidateIf((object, value) => value !== null)
  firstName: string | null;

  @IsString()
  @MaxLength(24)
  @ValidateIf((object, value) => value !== null)
  lastName: string | null;
}
