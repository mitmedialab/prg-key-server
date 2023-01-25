import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';

export const obscureTraffic = (passphrase?: string) => {
  passphrase ??= process.env.AES_PASSPHRASE as string;

  const encrypt = (text: string) => AES.encrypt(text, passphrase as string).toString();

  const decrypt = (ciphertext: string) => {
    const bytes = AES.decrypt(ciphertext, passphrase as string);
    const originalText = bytes.toString(Utf8);
    return originalText;
  };

  return { encrypt, decrypt };
}

export const encryptAll = (obj: Record<string, string>, encryption: (text: string) => string) =>
  Object.entries(obj).reduce((acc, [key, value]) => {
    acc[key] = encryption(value);
    return acc;
  }, {} as Record<string, string>)