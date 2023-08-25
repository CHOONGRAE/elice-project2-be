import { SonminsuRequestEntity } from '@entities';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateSonminsuRequestDto extends OmitType(SonminsuRequestEntity, [
  'id',
  'userId',
  'createdAt',
  'deletedAt',
  'isDone',
]) {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  content: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  groupName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  artistName: string;

  @IsOptional()
  @IsNotEmpty()
  @ApiProperty({ type: 'string', format: 'binary' })
  image: Express.Multer.File;
}
