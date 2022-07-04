import BigNumber from "bignumber.js";
import crypto from 'crypto'
import { EncryptedSeed } from "./asyncStorageHelper";

const PASSWORD_PREFIX = '1pR7Ej9vzE9HadEX1pR7Ej9vzE9HadEX' // This is needed for encryption since it takes minimum 16 character strings and someone might only give a password of 4 characters

export const safeParseFloat = (str: string): number => {
  const value = Number.parseFloat(str);

  return Number.isNaN(value) ? 0 : value;
};

export const satoshiToBitcoinString = (satoshi: number): string => {
  return satoshi ? new BigNumber(satoshi).dividedBy(100000000).toFixed(8) : "0";
};

export const bitcoinToSatoshiInteger = (btc: number): number => {
  return Math.floor(btc * 100000000);
};

export const formatAddress = (address: string): string => {
  return address && address.length
    ? address.slice(0, 4) + "..." + address.slice(-4)
    : "";
};

export const presentInteger = (value: number | string): string => {
  const parsedValue = +value
  return parsedValue ? (parsedValue < 0 ? "" : "+") + parsedValue.toFixed(8) : "0";
};

export const parseQr = (qr: string): { address: string, amount: string } => {
  const address = qr.split('bitcoin:')[1].split('?')[0]
  const amount = qr.split('?amount=')[1] ?? ''

  return { address, amount }
}

export const createQr = (address: string, amount?: number | string): string => {
  return 'bitcoin:' + address + '?amount=' + amount ?? ''
}

export const encrypt = (text: string, password: string): EncryptedSeed => {

    const algorithm = 'aes-256-ctr';
    const iv = crypto.randomBytes(16);
    const aesPassword = (password + PASSWORD_PREFIX).substring(0,32)
    const cipher = crypto.createCipheriv(algorithm, aesPassword, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

    return {
        iv: iv.toString('hex'),
        content: encrypted.toString('hex')
    };
};

export const decrypt = (hash: any, password: string): string => {

    const algorithm = 'aes-256-ctr';
    const aesPassword = (password + PASSWORD_PREFIX).substring(0,32)
    const decipher = crypto.createDecipheriv(algorithm, aesPassword, Buffer.from(hash.iv, 'hex'));
    const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);

    return decrpyted.toString();
};

