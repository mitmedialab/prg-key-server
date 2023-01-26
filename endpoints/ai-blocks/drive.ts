import { functionsURL, makeURLQueryString, obscureTraffic } from "../../utils";

export type URLParameters = { session: string };

export default async function (params: URLParameters) {
  const url = functionsURL + "/ai-blocks-drive" + makeURLQueryString<URLParameters>(params);
  const resp = await fetch(url);

  if (!resp.ok) {
    const text = await resp.text();
    return { error: text };
  }

  const json: [string, string][] = await resp.json();

  const { decrypt } = obscureTraffic(params.session);

  return json.map(([key, value]) => {
    return [decrypt(key), decrypt(value)];
  }).reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {} as Record<string, string>);
}