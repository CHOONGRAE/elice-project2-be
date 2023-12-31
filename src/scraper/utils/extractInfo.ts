import { CheerioAPI, load } from 'cheerio';

type Info = {
  [key: string]: string;
};

export type ExtractResult = {
  info: Info;
  $: CheerioAPI;
};

export const extract = (html: string) => {
  const $ = load(html);

  const info: Info = {};

  $('meta').each((idx, meta) => {
    if (!meta.attribs || (!meta.attribs.property && !meta.attribs.name)) return;
    const property = meta.attribs.property || meta.attribs.name;
    const content = meta.attribs.content || meta.attribs.value;

    if (/og:/i.test(property)) {
      const infoProperty = property.replace(/og:/i, '');
      if (!info[infoProperty]) info[infoProperty] = content;
    }
  });

  return { info, $ };
};
