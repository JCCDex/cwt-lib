import WalletInterface from "./interface/WalletInterface";
import { Factory } from "@swtc/wallet"
import { eddsa as EdDSA, ec as EC } from "elliptic";

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

const wallet = Factory("ripple");
function getElliptic(alg: string) {
  if(alg == "ed25519") {
    return new EdDSA('ed25519');
  }else if(alg == "secp256k1") {
    return new EC('secp256k1');
  }else{
    throw new Error(`${alg}: unsupported elliptic curve`);
  }
}

export default class RippleWallet implements WalletInterface{
  hexPrivatekey: string | undefined;
  hexPublickey: string;
  readonly alg: string;
  static elliptic: any;
  constructor(chain: string, alg: string, key: string, keyType: string) {
    this.alg = alg;
    RippleWallet.elliptic = getElliptic(alg);
    if(keyType == "public") {
      this.hexPublickey = stripHexPrefix(key, alg);
      if(this.alg == 'secp256k1') {
        this.hexPublickey = RippleWallet.elliptic.keyFromPublic(this.hexPublickey, 'hex').getPublic('hex');
      }
    }else if(keyType == "secret") {
      const keypair = wallet.KeyPair.deriveKeypair(key);
      this.hexPrivatekey = stripHexPrefix(keypair.privateKey, alg);
      this.hexPublickey = RippleWallet.elliptic.keyFromPublic(stripHexPrefix(keypair.publicKey, alg), 'hex').getPublic('hex');
    }else{
      throw new Error(`${chain}: unsupported key type: ${keyType}`);
    }
  }
  static generate(alg: string) {
    this.elliptic = getElliptic(alg);
    const secret_address = wallet.generate({algorithm: alg});
    const keypair = wallet.KeyPair.deriveKeypair(secret_address.secret);
    // return Object.assign(secret_address, {
    //   privateKey: stripHexPrefix(keypair.privateKey, alg).toLocaleLowerCase(),
    //   publicKey: this.elliptic.keyFromPublic(stripHexPrefix(keypair.publicKey, alg), 'hex').getPublic('hex')
    // })
    return Object.assign(secret_address, {
      privateKey: keypair.privateKey,
      publicKey: keypair.publicKey
    })
  }
}