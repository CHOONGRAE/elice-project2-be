import { ApiProperty, OmitType } from '@nestjs/swagger';
import { AuthEntity } from '../entities/auth.entity';

export class SigninDto extends OmitType(AuthEntity, ['id']) {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
