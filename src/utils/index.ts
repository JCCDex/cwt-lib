import { EthWallet, RippleWallet } from "../wallet";

// Bitcoin Ethereum
export const CHAIN_MAP = new Map<string, any>([
  ['ethereum', EthWallet],
  ['ripple', RippleWallet]
]);

export const CHAIN_USE_KEY = new Map<string, any>([
  ['ethereum', { sign: 'private', verify: 'public' }],
  ['ripple', { sign: 'secret', verify: 'public' }]
])

