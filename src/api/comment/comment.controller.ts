import { Controller, Get, Param } from '@nestjs/common';
import { CommentService } from './comment.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller({
  path: 'comments',
  version: '1',
})
@ApiTags('Comments API')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get(':feedId')
  @ApiOperation({
    summary: '댓글 목록',
  })
  async getComments(@Param('feedId') id: number) {
    return await this.commentService.getComments(id);
  }
}
