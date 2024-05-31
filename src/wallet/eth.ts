import { Wallet } from '@ethereumjs/wallet'
import { stripHexPrefix } from '@ethereumjs/util'

export default class EthWallet extends Wallet{
  hexPrivatekey: string | undefined;
  hexPublickey: string;
  constructor(priv: string | undefined, pub: string | undefined = undefined) {
    if(!priv && !pub)
      throw new Error('Wallet: priv or pub is required');
    const privKey = priv ? Buffer.from(stripHexPrefix(priv), 'hex') : undefined;
    let pubKey = pub ? Buffer.from(stripHexPrefix(pub), 'hex') : undefined;
    if(pubKey && pubKey.length == 65 && pubKey[0] == 4) {
      pubKey = pubKey.subarray(1); // remove 0x04 prefix
    }
    super(privKey, pubKey);
    this.hexPrivatekey = privKey ? stripHexPrefix(this.getPrivateKeyString()) : undefined;
    this.hexPublickey = stripHexPrefix(this.getPublicKeyString());
  }
}