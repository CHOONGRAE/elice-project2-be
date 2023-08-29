import { ApiProperty, OmitType } from '@nestjs/swagger';
import { CreateAuthDto } from './create-auth.dto';
import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UpdateAuthDto extends OmitType(CreateAuthDto, [
  'email',
  'password',
] as const) {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: true })
  userName: string;

  @IsOptional()
  @IsNumberString()
  @Length(8, 8)
  @ApiProperty({ required: true })
  birthDate: string;

  @IsOptional()
  @IsNumberString()
  @Length(10, 11)
  @ApiProperty({ required: true })
  phoneNumber: string;
}
