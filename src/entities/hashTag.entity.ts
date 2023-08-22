import { HashTags } from '@prisma/client';

export class HashTagEntity implements HashTags {
  id: number;
  tag: string;
}
