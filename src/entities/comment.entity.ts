import { Comments } from '@prisma/client';

export class CommentEntity implements Comments {
  id: number;
  feedId: number;
  parentId: number;
  userId: number;
  content: string;
  createdAt: Date;
  deletedAt: Date;
}
