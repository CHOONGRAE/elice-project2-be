import { FandomRanks } from '@prisma/client';

export class FandomRankEntity implements FandomRanks {
  fandomId: number;
  point: number;
}
