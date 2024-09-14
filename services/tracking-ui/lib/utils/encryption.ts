import AES from 'crypto-js/aes';
import encUtf8 from 'crypto-js/enc-utf8';

type DecryptOptions = {
  data: string;
  secretKey: string;
};

export const decrypt = ({ data, secretKey }: DecryptOptions): string => {
  return AES.decrypt(data, secretKey).toString(encUtf8);
};
