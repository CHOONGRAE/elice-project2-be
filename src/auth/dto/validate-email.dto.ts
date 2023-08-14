import { ApiProperty, PickType } from '@nestjs/swagger';
import { AuthEntity } from '../entities/auth.entity';

export class ValidateEmailDto extends PickType(AuthEntity, ['email']) {
  @ApiProperty()
  email: string;

  @ApiProperty()
  certificationString: string;
}
