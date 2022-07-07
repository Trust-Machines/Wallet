import { CachedWallet, EncryptedSeed } from "./asyncStorageHelper";

export const mapWalletToCachedWallet = (walletSecret: any, walletLabel: string, walletType?: string): CachedWallet => {
  return {
    seed: walletSecret,
    type: walletType ?? "HDsegwitBech32",
    label: walletLabel
  };
}

export const mapSeedToEncryptedSeed = (seed: any): EncryptedSeed => {
  return { content: seed.content, iv: seed.iv };
};