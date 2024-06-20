import WalletInterface from "./interface/WalletInterface";
import { Factory } from "@swtc/wallet"
import { eddsa as EdDSA, ec as EC } from "elliptic";

interface Ioption {
  algorithm?: string,
  guomi?: boolean,
}

const stripHexPrefix = (str: string, alg: string): string => {
  if (typeof str !== 'string')
    throw new Error(`[stripHexPrefix] input must be type 'string', received ${typeof str}`)
  switch (alg) {
    case "ed25519":
      return str.match(/^ED[0-9A-Fa-f]*$/) ? str.slice(2) : str;
    case "secp256k1":
      return str.match(/^00[0-9A-Fa-f]*$/) ? str.slice(2) : str;
    default:
      return str;
  }
}

function getElliptic(alg: string) {
  if(alg == "ed25519") {
    return new EdDSA('ed25519');
  }else if(alg == "secp256k1") {
    return new EC('secp256k1');
  }else{
    throw new Error(`${alg}: unsupported elliptic curve`);
  }
}

export default class JingtumWallet implements WalletInterface{
  hexPrivatekey: string | undefined;
  hexPublickey: string;
  readonly guomi: boolean;
  readonly alg: string;
  static elliptic: any;
  constructor(chain: string, alg: string, key: string, keyType: string, guomi: boolean = false) {
    this.guomi = guomi ? true : false;
    if(guomi)
      throw new Error(`${chain}: guomi does not support it yet`);
    this.alg = alg;
    JingtumWallet.elliptic = getElliptic(alg);
    if(keyType == "public") {
      this.hexPublickey = stripHexPrefix(key, alg);
      if(this.alg == 'secp256k1') {
        this.hexPublickey = JingtumWallet.elliptic.keyFromPublic(this.hexPublickey, 'hex').getPublic('hex');
      }
    }else if(keyType == "secret") {
      const wallet = Factory({ guomi });
      const keypair = wallet.KeyPair.deriveKeypair(key);
      this.hexPrivatekey = stripHexPrefix(keypair.privateKey, alg);
      this.hexPublickey = JingtumWallet.elliptic.keyFromPublic(stripHexPrefix(keypair.publicKey, alg), 'hex').getPublic('hex');
    }else{
      throw new Error(`${chain}: unsupported key type: ${keyType}`);
    }
  }
  static generate(opt: Ioption = {}){
    const guomi = opt.guomi ? true : false;
    if(guomi)
      throw new Error(`jingtum: guomi does not support it yet`);
    const alg = opt.algorithm || "secp256k1";
    const wallet = Factory({ guomi });
    const secret_address = wallet.generate({ algorithm: alg });
    const keypair = wallet.KeyPair.deriveKeypair(secret_address.secret);
    return Object.assign(secret_address, {
      privateKey: keypair.privateKey,
      publicKey: keypair.publicKey
    })
  }
}