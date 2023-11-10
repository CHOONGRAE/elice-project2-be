import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { ChatGateway } from './chat.gateway';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { User } from '@decorator/User.decorator';
import { CreateMessageDto } from '@dto/messageDto/create-message.dto';
import { AuthGuard } from '@guards/auth.guard';

@Controller({
  path: 'users/chats',
  version: '1',
})
export class ChatController {
  constructor(
    private readonly messageService: MessageService,
    private readonly chatGateway: ChatGateway,
  ) {}
  @Post()
  @UseGuards(AuthGuard)
  @ApiBearerAuth('Authorization')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      fileFilter: (req, file, cb) => {
        if (/image/i.test(file.mimetype)) {
          file.originalname = Buffer.from(file.originalname, 'latin1').toString(
            'utf-8',
          );
          cb(null, true);
        } else {
          cb(null, false);
        }
      },
    }),
  )
  @ApiConsumes('multipart/form-data')
  async test(
    @UploadedFiles() files: Express.Multer.File[],
    @User() userId: number,
    @Body() createMessageDto: CreateMessageDto,
  ) {
    const newMessage = await this.messageService.createFilesMessage(
      userId,
      files,
      createMessageDto,
    );

    this.chatGateway.server
      .in(`room-${createMessageDto.fandomId}`)
      .emit('bias', newMessage);
  }
}
