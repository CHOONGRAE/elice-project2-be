import { CommentService } from '@api/comment/comment.service';
import { User } from '@decorator/User.decorator';
import { CreateCommentDto } from '@dto/commentDto/create-comment.dto';
import { AuthGuard } from '@guards/auth.guard';
import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller({
  path: 'users/comments',
  version: '1',
})
@ApiTags('Users / Comments API')
@UseGuards(AuthGuard)
@ApiBearerAuth('Authorization')
export class UserCommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':feedId')
  @ApiOperation({
    summary: '댓글 작성',
  })
  async createComment(
    @User() userId: number,
    @Param('feedId') feedId: number,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return await this.commentService.createComment(
      userId,
      feedId,
      createCommentDto,
    );
  }

  @Delete(':commentId')
  @ApiOperation({
    summary: '댓글 삭제',
  })
  async deleteComment(@User() userId: number, @Param('commentId') id: number) {
    await this.commentService.deleteComment(id, userId);
  }
}
