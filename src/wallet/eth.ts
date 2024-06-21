import { Wallet } from '@ethereumjs/wallet'
import WalletInterface from './interface/WalletInterface';

const stripHexPrefix = (str: string): string => {
  if (typeof str !== 'string')
    throw new Error(`[stripHexPrefix] input must be type 'string', received ${typeof str}`)

  return str.match(/^0x[0-9A-Fa-f]*$/) ? str.slice(2) : str
}

export default class EthWallet extends Wallet implements WalletInterface{
  hexPrivatekey: string | undefined;
  hexPublickey: string;
  readonly alg: string;
  constructor(chain: string, alg: string, key: string, keyType: string) {
    if(keyType == 'public') {
      super(undefined, Buffer.from(stripHexPrefix(key), 'hex'));
      this.hexPrivatekey = undefined;
      this.hexPublickey = '04' + stripHexPrefix(this.getPublicKeyString());
    }else if(keyType == 'private') {
      super(Buffer.from(stripHexPrefix(key), 'hex'));
      this.hexPrivatekey = stripHexPrefix(this.getPrivateKeyString());
      this.hexPublickey = '04' + stripHexPrefix(this.getPublicKeyString());
    }else {
      throw new Error(`${chain}: unsupported key type: ${keyType}`);
    }
    this.alg = alg;
  }
}