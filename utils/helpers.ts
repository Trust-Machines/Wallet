import BigNumber from "bignumber.js";

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