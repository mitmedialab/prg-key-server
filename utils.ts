import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import Base64 from 'crypto-js/enc-base64';

import { lib } from 'crypto-js';

const jsonFormatter = {
  stringify: function (cipherParams: lib.CipherParams) {
    const jsonObj: Record<string, string> = { ct: cipherParams.ciphertext.toString(Base64) };

    if (cipherParams.iv) jsonObj.iv = cipherParams.iv.toString();
    if (cipherParams.salt) jsonObj.s = cipherParams.salt.toString();

    return JSON.stringify(jsonObj);
  },
  parse: function (jsonStr: string) {
    const jsonObj: Record<string, string> = JSON.parse(jsonStr);

    const cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(jsonObj.ct)
    });

    if (jsonObj.iv) cipherParams.iv = CryptoJS.enc.Hex.parse(jsonObj.iv);
    if (jsonObj.s) cipherParams.salt = CryptoJS.enc.Hex.parse(jsonObj.s);

    return cipherParams;
  }
};

export const obscureTraffic = (passphrase?: string) => {
  passphrase ??= process.env.AES_PASSPHRASE as string;
  const options = { format: jsonFormatter };

  const encrypt = (text: string) => AES.encrypt(text, passphrase as string, options);

  const decrypt = (ciphertext: string) => {
    const bytes = AES.decrypt(ciphertext, passphrase as string, options);
    const originalText = bytes.toString(Utf8);
    return originalText;
  };

  return { encrypt, decrypt };
}

export const encryptAll = (obj: Record<string, string>, encryption: (text: string) => lib.CipherParams) =>
  Object.entries(obj).reduce((acc, [key, value]) => {
    acc.push([JSON.stringify(encryption(key).toString()), JSON.stringify(encryption(value).toString())]);
    return acc;
  }, [] as [string, string][]);