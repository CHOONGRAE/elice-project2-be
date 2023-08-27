import { CommentEntity } from '@entities';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateCommentDto extends PartialType(CommentEntity) {
  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false, default: null })
  parentId: number;

  @IsString()
  @ApiProperty()
  content: string;
}
