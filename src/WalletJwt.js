import { TokenSigner, decodeToken, TokenVerifier, SECP256K1Client } from 'jsontokens'
import { escape } from 'jsontokens/lib/base64Url.js'
import { fromByteArray } from 'base64-js';
import * as formatter from "ecdsa-sig-formatter"
import { Wallet } from '@ethereumjs/wallet'
import { isValidPrivate, isValidPublic, stripHexPrefix } from '@ethereumjs/util'
import KeyEncoder from "key-encoder";

class WalletJwt {
  // 签名 jwt
  static sign(data, priv, format = 'jose') {
    const { header, payload } = data;
    if(!payload || !header){
      throw new Error('The signature content must contain header and payload.');
    }

    priv = stripHexPrefix(priv);
    if(isValidPrivate(priv)){
      const adjustHeader = Object.assign({typ: undefined, alg: undefined}, header);
      // 使用私钥签名 jwt
      const token = new TokenSigner("ES256k", priv).sign(payload, false, adjustHeader);
      if(format == 'jose') {
        return token;
      }else if (format == 'der') {
        const tokenList = token.split(".");
        return tokenList[0] + "." + tokenList[1] + "." + escape(fromByteArray(formatter.joseToDer(tokenList[2], "ES256")));
      }else {
        throw new Error('format must be jose or der,saw '+format);
      }
    } else {
      throw new Error('invalid private key');
    }
  }

  // 解码 jwt
  static decode(token) {
    return decodeToken(token);
  }

  // 验证 jwt
  static verify(token, pub, format = 'jose') {
    if(typeof pub != "string") {
      throw new Error('The public key used for verification must be a hex string');
    }
    
    let pubKey = pub;
    pubKey = stripHexPrefix(pubKey);
    let isCompress = pubKey.length == 128 ? false : true;
    if(isValidPublic(Buffer.from(pubKey, "hex"), isCompress)) {
      pubKey = (isCompress ? "" : "04") + pubKey;
      if(format == 'jose') {
        return new TokenVerifier("ES256k", pubKey).verify(token);
      }else if (format == 'der') {
        const tokenList = token.split(".");
        const handleToken = tokenList[0] + "." + tokenList[1] + "." + formatter.derToJose(tokenList[2], 'ES256');
        return new TokenVerifier("ES256k", pubKey).verify(handleToken);
      }else {
        throw new Error('format must be jose or der,saw '+format);
      }
    } else {
      throw new Error('invalid public key');
    }
  }

  // 生成钱包
  static generate() {
    const wallet = Wallet.generate();
    return {
      privateKey: wallet.getPrivateKeyString(),
      publicKey: wallet.getPublicKeyString(),
      compressPubKey: this.compressPubKey(wallet.getPrivateKey()),
      address: wallet.getAddressString()
    }
  }

  // 通过私钥压缩公钥
  static compressPubKey(priv) {
    let privKey = priv;
    if(typeof privKey != "string") {
      privKey = Buffer.from(privKey, "hex").toString("hex");
    }
    privKey = stripHexPrefix(privKey);
    if(isValidPrivate(privKey)){
      return SECP256K1Client.derivePublicKey(privKey);
    } else {
      throw new Error('invalid private key');
    }
  }

  // 将私钥转换成pem格式(SEC1)
  static privToPem(pr) {
    const priv = stripHexPrefix(pr);
    if(isValidPrivate(priv)){
      const keyEncode = KeyEncoder.default ? new KeyEncoder.default('secp256k1') : new KeyEncoder('secp256k1');
      return keyEncode.encodePrivate(priv, 'raw', 'pem');
    } else {
      throw new Error('invalid private key');
    }
  }

  // 将公钥转换成pem格式(SPKI)
  static pubToPem(pu) {
    let pub = stripHexPrefix(pu);
    if(pub.length == 130 && pub.startsWith("04")){
      pub = pub.slice(2);
    }
    if(isValidPublic(Buffer.from(pub, "hex"), false)) {
      const keyEncode = KeyEncoder.default ? new KeyEncoder.default('secp256k1') : new KeyEncoder('secp256k1');
      return keyEncode.encodePublic("04"+pub, 'raw', 'pem');
    } else {
      throw new Error('Invalid uncompressed public key');
    }
  }
}

export default WalletJwt;