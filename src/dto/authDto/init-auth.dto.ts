import { UserEntity } from '@entities';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class InitAuthDto extends PartialType(UserEntity) {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Min(2)
  @ApiProperty({ required: false, type: 'string' })
  nickName?: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @Min(10)
  @ApiProperty({ required: false, type: 'string' })
  introduction?: string;

  @IsOptional()
  @ApiProperty({ required: false, type: 'string', format: 'binary' })
  file?: Express.Multer.File;
}
