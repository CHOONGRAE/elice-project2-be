import { ApiProperty, PickType } from '@nestjs/swagger';
import { AuthEntity } from '../entities/auth.entity';

export class VerificateCodeDto extends PickType(AuthEntity, ['email']) {
  @ApiProperty()
  email: string;

  @ApiProperty()
  code: string;
}
