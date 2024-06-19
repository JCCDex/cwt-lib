import * as bitcoin from 'bitcoinjs-lib';
import ECPairFactory from 'ecpair';
import * as ecc from 'tiny-secp256k1';
import WalletInterface from './interface/WalletInterface';
import { eddsa as EdDSA, ec as EC } from "elliptic";

const network = bitcoin.networks.bitcoin;
const ECPair = ECPairFactory(ecc);
const ec = new EC('secp256k1');

export default class BitcoinWallet implements WalletInterface{
  hexPrivatekey: string | undefined;
  hexPublickey: string;
  readonly alg: string;
  constructor(chain: string, alg: string, key: string, keyType: string) {
    let keyPairInstance;
    if(keyType == 'public') {
      keyPairInstance = ECPair.fromPublicKey(Buffer.from(key, 'hex'), { network });
      this.hexPublickey = keyPairInstance.publicKey?.toString('hex');
      this.hexPublickey = ec.keyFromPublic(this.hexPublickey, 'hex').getPublic('hex')
    }else if(keyType == 'private') {
      if(key.length == 64){
        keyPairInstance = ECPair.fromPrivateKey(Buffer.from(key, 'hex'), { network });
        this.hexPrivatekey = keyPairInstance.privateKey?.toString('hex');
        this.hexPublickey = keyPairInstance.publicKey?.toString('hex');
        this.hexPublickey = ec.keyFromPublic(this.hexPublickey, 'hex').getPublic('hex')
      }else{
        keyPairInstance = ECPair.fromWIF(key);
        this.hexPrivatekey = keyPairInstance.privateKey?.toString('hex');
        this.hexPublickey = keyPairInstance.publicKey?.toString('hex');
        this.hexPublickey = ec.keyFromPublic(this.hexPublickey, 'hex').getPublic('hex')
      }
    }else {
      throw new Error(`${chain}: unsupported key type: ${keyType}`);
    }
    this.alg = alg;
  }
  static generate() {
    const keyPairInstance = ECPair.makeRandom({ network });
    const p2pkh = bitcoin.payments.p2pkh({ pubkey: keyPairInstance.publicKey!, network });
    const p2wpkh = bitcoin.payments.p2wpkh({ pubkey: keyPairInstance.publicKey!, network });
    return {
      privateKey: keyPairInstance.privateKey ? keyPairInstance.privateKey.toString('hex') : "",
      publicKey: keyPairInstance.publicKey?.toString('hex'),
      privateKeyWif: keyPairInstance.toWIF(),
      p2pkhAdress: p2pkh.address,
      p2wpkhAdress: p2wpkh.address,
    }
  }
}