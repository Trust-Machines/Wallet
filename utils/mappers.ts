import { EncryptedSeed } from "@redux/walletSlice";

export const mapSeedToEncryptedSeed = (seed: any): EncryptedSeed => {
  return { content: seed.content, iv: seed.iv };
};
