import * as cheerio from "cheerio";

export const version = async (id: string) => {
  const url = `https://play.google.com/store/apps/details?id=${id}&hl=fr&gl=fr&pli=1`;
  const res = await fetch(url).then((r) => r.text());
  const $ = cheerio.load(res);

  const relaxed = (i: string): any => {
    const start = "AF_initDataCallback(";
    const start_i = i.indexOf(start) + start.length;
    return eval("(" + i.substring(start_i, i.lastIndexOf(");")) + ")");
  };

  const data = relaxed($("script.ds\\:5").text()).data[1][2];

  const title = data[0][0] as string;
  const icon = data[95][0][3][2] as string;
  const version = data[112]["141"][0][0][0] as string;
  const updated = new Date((data[112]["146"][0][1][0] as number) * 1000);

  return {
    title,
    version,
    updated,
    icon,
  };
};
