import { BadRequestException, Injectable } from '@nestjs/common';
import { requests, extract, resultCheck } from './utils';

@Injectable()
export class ScraperService {
  async doScrap(url: string) {
    try {
      const res = await requests(url);

      const extracted = extract(res);

      const result = resultCheck(extracted);

      return result;
    } catch (e) {
      throw new BadRequestException(
        '잘못된 링크이거나, 접근 할수 없는 링크입니다.\n관리자에게 문의해 주세요.',
      );
    }
  }
}
