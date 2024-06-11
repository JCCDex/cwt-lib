import KeyEncoder from "key-encoder";
import * as crypto from 'crypto';
import { eddsa as EdDSA } from 'elliptic'

function getPrivatePem(priv: string, alg: string) {
  switch(alg){
    case "secp256k1":
      const keyEncode = new KeyEncoder('secp256k1');
      return keyEncode.encodePrivate(priv, 'raw', 'pem');
    case "ed25519":
      const der = "302e020100300506032b657004220420" + priv;
      const keyObj = crypto.createPrivateKey({
        key: Buffer.from(der, 'hex'),
        format: 'der',
        type: 'pkcs8'
      })
      return keyObj.export({type: 'pkcs8', format: 'pem'});
    default:
      throw new Error(`Unsupported algorithm: ${alg}`);
  }
}

function getPublicPem(pub: string, alg: string) {
  switch(alg){
    case "secp256k1":
      let pubKey = pub;
      pubKey = pubKey.length == 130 && pubKey.startsWith("04") ? pubKey : "04" + pubKey;
      const keyEncode = new KeyEncoder('secp256k1');
      return keyEncode.encodePublic(pubKey, 'raw', 'pem');
    case "ed25519":
      const der = "302a300506032b6570032100" + pub;
      const keyObj = crypto.createPublicKey({
          key: Buffer.from(der, 'hex'),
          format: 'der',
          type: 'spki'
      })
      return keyObj.export({type: 'spki',format: 'pem'});
    default:
      throw new Error(`Unsupported algorithm: ${alg}`);
  }
}

export { getPrivatePem, getPublicPem }