import { Wallet } from '@ethereumjs/wallet'
import { stripHexPrefix } from '@ethereumjs/util'
import WalletInterface from './interface/WalletInterface';

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