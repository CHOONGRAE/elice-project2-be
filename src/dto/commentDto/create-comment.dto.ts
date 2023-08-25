import { CommentEntity } from '@entities';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreateCommentDto extends PartialType(CommentEntity) {
  @ApiProperty()
  feedId: number;

  @ApiProperty()
  parentId: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  content: string;
}
