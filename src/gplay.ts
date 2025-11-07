import { load } from "cheerio";

class Element<T> {
  private keys: Array<Array<string | number>>;
  private modifier?: (value: any) => T;

  public constructor(...keys: Array<Array<string | number>>) {
    this.keys = keys;
  }

  public mod(modifier?: (value: any) => any) {
    this.modifier = modifier;
    return this;
  }

  public dump(source: any): T {
    let result: any;

    for (const keys of this.keys) {
      result = null;

      try {
        result = nested(source, keys);
      } catch {
        result = null;
      }

      if (result) break;
    }

    if (!result) {
      // NOTE: we print the entire Google Play JSON to be able to debug
      //       why it didn't work at some point.
      console.log("here's the entire dump ---------------------------------");
      console.log(JSON.stringify(source, null, 2));
      console.log("--------------------------------------------------------");

      throw new Error("can't retrieve content from google play");
    }

    return this.modifier?.(result) ?? result;
  }
}

const nested = (source: any, keys: Array<string | number>): any => {
  let current = source;

  for (const key of keys) {
    try {
      current = current[key];
    } catch {
      return null;
    }
  }

  return current;
};

const relaxed = (i: string): any => {
  const start = "AF_initDataCallback(";
  const start_i = i.indexOf(start) + start.length;
  return eval("(" + i.substring(start_i, i.lastIndexOf(");")) + ")");
};

const App = {
  Title: new Element<string>([1, 2, 0, 0]),
  Icon: new Element<URL>([1, 2, 95, 0, 3, 2]).mod((href) => new URL(href)),
  Version: new Element<string>(
    [1, 2, 112, "141", 0, 0, 0],
    [1, 2, 103, "141", 0, 0, 0],
    [1, 2, 140, 0, 0, 0]
  ),
  Updated: new Element<Date>(
    [1, 2, 112, "146", 0, 1, 0],
    [1, 2, 145, 0, 1, 0],
    [1, 2, 145, 0, 0]
  ).mod((value) => new Date(value * 1000)),
};

export const version = async (id: string) => {
  const url = `https://play.google.com/store/apps/details?id=${id}&hl=fr&gl=fr&pli=1`;
  const res = await fetch(url).then((r) => r.text());
  const { data } = relaxed(load(res)("script.ds\\:5").text());

  const version = App.Version.dump(data);
  const title = App.Title.dump(data);
  const icon = App.Icon.dump(data);
  const updated = App.Updated.dump(data);

  return {
    title,
    version,
    updated,
    icon,
  };
};
