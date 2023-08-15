import { ApiProperty, IntersectionType, OmitType } from '@nestjs/swagger';
import { AuthEntity, UserEntity } from '../entities';

export class CreateAuthDto extends IntersectionType(
  OmitType(AuthEntity, ['id'] as const),
  OmitType(UserEntity, ['userId', 'selectedAnswerCount', 'createdAt'] as const),
) {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  userName: string;

  @ApiProperty()
  birthDate: string;

  @ApiProperty()
  phoneNumber: string;
}
