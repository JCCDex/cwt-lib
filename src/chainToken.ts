import KeyEncoder from "key-encoder";

// 1. 私钥转PEM
function privateKeyToPem(privateKey: string): string {
  const keyEncode = new KeyEncoder('secp256k1');
  return keyEncode.encodePrivate(privateKey, 'raw', 'pem');
}
  
// 2. 公钥转PEM
function publicKeyToPem(publicKey: string): string {
  const keyEncode = new KeyEncoder('secp256k1');
  return keyEncode.encodePublic(publicKey, 'raw', 'pem');
}

class ChainToken {
  static privateKeyToPem = privateKeyToPem;
  static publicKeyToPem = publicKeyToPem;
  readonly chain: string
  constructor (key: string, chain: string){
    this.chain = chain;
  }
}