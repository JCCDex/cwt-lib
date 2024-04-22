import { TokenSigner, decodeToken, TokenVerifier, SECP256K1Client } from 'jsontokens'
import { Wallet } from '@ethereumjs/wallet'
import { isValidPrivate, isValidPublic, stripHexPrefix } from '@ethereumjs/util'

class WalletJwt {
  // 签名 jwt
  static sign(data, priv) {
    const { header, payload } = data;
    if(!payload){
      throw new Error('payload is required');
    }

    priv = stripHexPrefix(priv);
    if(isValidPrivate(priv)){
      // 使用私钥签名 jwt
      return new TokenSigner("ES256k", priv).sign(payload, false, header);
    } else {
      throw new Error('invalid private key');
    }
  }

  // 解码 jwt
  static decode(token) {
    return decodeToken(token);
  }

  // 验证 jwt
  static verify(token, pub) {
    if(typeof pub != "string") {
      throw new Error('The public key used for verification must be a hex string');
    }
    
    let pubKey = pub;
    pubKey = stripHexPrefix(pubKey);
    let isCompress = pubKey.length == 128 ? false : true;
    if(isValidPublic(Buffer.from(pubKey, "hex"), isCompress)) {
      pubKey = (isCompress ? "" : "04") + pubKey;
      return new TokenVerifier("ES256k", pubKey).verify(token);
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
}

export default WalletJwt;