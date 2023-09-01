import { ExtractResult } from './extractInfo';

const isExist = (keys: string[], regExp: RegExp) =>
  !!keys.find((v: string) => regExp.test(v));

export const resultCheck = ({ info, $ }: ExtractResult) => {
  const keys = Object.keys(info);
  console.log(info);

  if (!isExist(keys, /image/i)) {
    console.log('사진 없슴');
  }

  if (!isExist(keys, /title/i)) {
    console.log('타이틀 없슴');
  }

  if (!isExist(keys, /price/i)) {
    const price = $('strong')
      .text()
      .match(/(\d|,)+(원|\$)/gi); // 쿠팡,네이버
    console.log(price);
    console.log('가격 없슴');
    info.price = price[0];
  }

  if (!isExist(keys, /imgurl/i)) {
    console.log('IMGURL 없슴');
  }

  if (!isExist(keys, /originurl/i)) {
    console.log('ORIGNURL 없슴');
  }

  console.log(info);

  return info;
};
