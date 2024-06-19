import { EthWallet, RippleWallet, BitcoinWallet, JingtumWallet } from "../wallet";

// Bitcoin Ethereum
export const CHAIN_MAP = new Map<string, any>([
  ['ethereum', EthWallet],
  ['ripple', RippleWallet],
  ['bitcoin', BitcoinWallet],
  ['jingtum', JingtumWallet]
]);

export const CHAIN_USE_KEY = new Map<string, any>([
  ['ethereum', { sign: 'private', verify: 'public' }],
  ['ripple', { sign: 'secret', verify: 'public' }],
  ['bitcoin', { sign: 'private', verify: 'public' }],
  ['jingtum', { sign: 'secret', verify: 'public' }],
])

