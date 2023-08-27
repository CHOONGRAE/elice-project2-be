import { SonminsuAnswerService } from '@api/sonminsu-answer/sonminsu-answer.service';
import { User } from '@decorator/User.decorator';
import { CreateSonminsuAnswerDto } from '@dto/sonminsuAnswerDto/create-sonminsuAnswer.dto';
import { UpdateSonminsuAnswerDto } from '@dto/sonminsuAnswerDto/update-sonminsuAnswer.dto';
import { AuthGuard } from '@guards/auth.guard';
import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller({
  path: 'users/sonminsu-answers',
  version: '1',
})
@ApiTags('Users / SonminsuAnswers API')
@UseGuards(AuthGuard)
@ApiBearerAuth('Authorization')
export class UserSonminsuAnswerController {
  constructor(private readonly sonminsuAnswerService: SonminsuAnswerService) {}

  @Post(':requestId')
  @ApiOperation({
    summary: '의뢰 답변 작성',
  })
  async createSonminsuAnswer(
    @User() userId: number,
    @Param('requestId') requestId: number,
    @Body() createSonminsuAnswerDto: CreateSonminsuAnswerDto,
  ) {
    await this.sonminsuAnswerService.createSonminsuAnswer(
      userId,
      requestId,
      createSonminsuAnswerDto,
    );
  }

  @Patch(':answerId')
  @ApiOperation({
    summary: '의뢰 답변 수정',
  })
  async updateSonminsuAnswer(
    @User() userId: number,
    @Param('answerId') answerId: number,
    @Body() updateSonminsuAnswerDto: UpdateSonminsuAnswerDto,
  ) {
    await this.sonminsuAnswerService.updateSonminsuAnswer(
      answerId,
      userId,
      updateSonminsuAnswerDto,
    );
  }

  @Delete(':answerId')
  @ApiOperation({
    summary: '의뢰 답변 삭제',
  })
  async deleteSonminsuAnswer(
    @User() userId: number,
    @Param('answerId') answerId: number,
  ) {
    await this.sonminsuAnswerService.deleteSonminsuAnswer(answerId, userId);
  }

  @Put(':answerId/choose')
  @ApiOperation({
    summary: '의뢰 답변 채택',
  })
  async chooseSonminsuAnswer(
    @User() userId: number,
    @Param('requestId') answerId: number,
  ) {
    await this.sonminsuAnswerService.chooseSonminsuAnswer(answerId, userId);
  }
}
