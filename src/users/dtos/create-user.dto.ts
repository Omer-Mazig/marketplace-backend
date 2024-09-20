import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserTier } from '../enums/user-tier.enum';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(96)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(96)
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @MaxLength(96)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(96)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
    message:
      'Minimin 8 character , at least one letter, one number and one spacial character',
  })
  password: string;

  @IsEnum(UserTier)
  @IsNotEmpty()
  userTier: UserTier;
}
