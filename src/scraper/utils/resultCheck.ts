import { ExtractResult } from './extractInfo';

const isExist = (keys: string[], regExp: RegExp) =>
  !!keys.find((v: string) => regExp.test(v));

export const resultCheck = ({ info, $ }: ExtractResult) => {
  const keys = Object.keys(info);

  if (!isExist(keys, /image/i)) {
    console.log('사진 없슴');
  }

  if (!isExist(keys, /title/i)) {
    console.log('타이틀 없슴');
  }

  if (!isExist(keys, /price/i)) {
    console.log('가격 없슴');
  }

  if (!isExist(keys, /url/i)) {
    console.log('URL 없슴');
  }

  return info;
};
