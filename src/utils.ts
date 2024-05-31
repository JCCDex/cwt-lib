import EthWallet from "./wallet/eth";

// Bitcoin Ethereum
export const chainMap = new Map([
  ['ethereum', EthWallet],
  ['bitcoin', EthWallet]
]);