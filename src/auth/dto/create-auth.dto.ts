import { ApiProperty, OmitType } from '@nestjs/swagger';
import { AuthEntity } from '../entities';

export class CreateAuthDto extends OmitType(AuthEntity, ['id']) {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
