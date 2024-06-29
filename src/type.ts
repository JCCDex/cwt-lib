export enum Alg {
  Ed25519 = "ed25519",
  Secp256k1 = "secp256k1"
}

export enum Chain {
  Bitcoin = "bitcoin",
  Ethereum = "ethereum",
  Jingtum = "jingtum",
  Ripple = "ripple"
}

export enum PrivateKeyFlag {
  ED = "ED"
}

export interface ISignData {
  usr: string;
  time?: number;
}

export interface IKeyPair {
  privateKey: string;
  publicKey: string;
}

export interface IQuickSignData {
  chain: string;
  privateKey: string;
  usr: string;
  time?: number;
  alg?: string;
}
