import { ApiProperty, OmitType } from '@nestjs/swagger';
import { AuthEntity } from '../entities';

export class SigninDto extends OmitType(AuthEntity, ['id'] as const) {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
