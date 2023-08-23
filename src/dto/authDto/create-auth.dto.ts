import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';
import { AuthEntity, UserEntity } from '@entities';
import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateAuthDto extends IntersectionType(
  PartialType(AuthEntity),
  PartialType(UserEntity),
) {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8)
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  userName: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(8, 8)
  @ApiProperty()
  birthDate: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(10, 11)
  @ApiProperty()
  phoneNumber: string;
}
