import { lib, enc, AES } from 'crypto-js';

export const functionsURL = "https://prg-key-server.netlify.app/.netlify/functions";

export const makeURLQueryString = <T extends Record<string, string>>(obj: T) =>
  "?" + Object.entries(obj).map(([key, value]) => `${key}=${value}`).join("&");

const jsonFormatter = {
  stringify: function (cipherParams: lib.CipherParams) {
    const jsonObj: Record<string, string> = { ct: cipherParams.ciphertext.toString(enc.Base64) };

    if (cipherParams.iv) jsonObj.iv = cipherParams.iv.toString();
    if (cipherParams.salt) jsonObj.s = cipherParams.salt.toString();

    return JSON.stringify(jsonObj);
  },
  parse: function (jsonStr: string) {
    const jsonObj: Record<string, string> = JSON.parse(jsonStr);

    const cipherParams = lib.CipherParams.create({
      ciphertext: enc.Base64.parse(jsonObj.ct)
    });

    if (jsonObj.iv) cipherParams.iv = enc.Hex.parse(jsonObj.iv);
    if (jsonObj.s) cipherParams.salt = enc.Hex.parse(jsonObj.s);

    return cipherParams;
  }
};

export const obscureTraffic = (passphrase?: string) => {
  passphrase ??= process.env.AES_PASSPHRASE as string;
  const options = { format: jsonFormatter };

  const encrypt = (text: string) => AES.encrypt(text, passphrase as string, options);

  const decrypt = (ciphertext: string) => {
    const bytes = AES.decrypt(ciphertext, passphrase as string, options);
    const originalText = bytes.toString(enc.Utf8);
    return originalText;
  };

  return { encrypt, decrypt };
}

export const encryptAll = (obj: Record<string, string>, encryption: (text: string) => lib.CipherParams) =>
  Object.entries(obj).reduce((acc, [key, value]) => {
    acc.push([encryption(key).toString(), encryption(value).toString()]);
    return acc;
  }, [] as [string, string][]);