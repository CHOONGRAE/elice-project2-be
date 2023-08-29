import { ApiProperty, IntersectionType, PartialType } from '@nestjs/swagger';
import { AuthEntity, UserEntity } from '@entities';
import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
} from 'class-validator';

export class CreateAuthDto extends IntersectionType(
  PartialType(AuthEntity),
  PartialType(UserEntity),
) {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  code: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @ApiProperty({ required: true })
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8)
  @ApiProperty({ required: true })
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  userName: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(8, 8)
  @ApiProperty({ required: true })
  birthDate: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(10, 11)
  @ApiProperty({ required: true })
  phoneNumber: string;
}
