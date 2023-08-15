import { ApiProperty, OmitType } from '@nestjs/swagger';
import { AuthEntity } from '../entities';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class SigninDto extends OmitType(AuthEntity, ['id'] as const) {
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
}
