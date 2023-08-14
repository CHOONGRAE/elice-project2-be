import { ApiProperty, PickType } from '@nestjs/swagger';
import { AuthEntity } from '../entities';

export class VerificateCodeDto extends PickType(AuthEntity, [
  'email',
] as const) {
  @ApiProperty()
  email: string;

  @ApiProperty()
  code: string;
}
