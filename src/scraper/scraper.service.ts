import { BadRequestException, Injectable } from '@nestjs/common';
import { requests, extract, resultCheck } from './utils';

@Injectable()
export class ScraperService {
  async doScrap(
    url = 'https://www.coupang.com/vp/products/7495068226?vendorItemId=85271418374&sourceType=HOME_GW_PROMOTION&searchId=feed-cfc281f48e3b46cab288fdb0ae388ca1-gw_promotion&isAddedCart=',
  ) {
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
