import { UserEntity } from '@entities';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto extends UserEntity {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: false })
  nickName: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ required: false })
  introduction: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ required: false, type: 'string', format: 'binary' })
  file: Express.Multer.File;
}
