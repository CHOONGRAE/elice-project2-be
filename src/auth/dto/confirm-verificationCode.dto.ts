import { ApiProperty, PickType } from '@nestjs/swagger';
import { AuthEntity } from '../entities';
import { IsNotEmpty, IsString } from 'class-validator';

export class ConfirmVerificationCodeDto extends PickType(AuthEntity, [
  'email',
] as const) {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  code: string;
}
