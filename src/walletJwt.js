import { TokenSigner, decodeToken, TokenVerifier, SECP256K1Client } from 'jsontokens'
import { Wallet } from '@ethereumjs/wallet'
import { isValidPrivate, isValidPublic, } from '@ethereumjs/util'

class walletJwt {
  // 签名 jwt
  static signOfjwt(data, priv) {
    const { header, payload } = data;
    if(!payload){
      throw new Error('payload is required');
    }

    if(typeof priv == "string" && priv.length >64){
      priv = priv.slice(-64);
    }
    if(isValidPrivate(priv)){
      // 使用私钥签名 jwt
      return new TokenSigner("ES256k", priv).sign(payload, false, header);
    } else {
      throw new Error('invalid private key');
    }
  }

  // 解码 jwt
  static decodeOfjwt(token) {
    return decodeToken(token);
  }

  // 验证 jwt
  static verifyOfjwt(token, pub) {
    // 使用压缩公钥验证 jwt
    return new TokenVerifier("ES256k", pub).verify(token);
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

  // 压缩公钥
  static compressPubKey(priv) {
    let privKey = priv;
    if(typeof privKey == "string" && privKey.length >64){
      privKey = privKey.slice(-64);
    }
 
    if(isValidPrivate(privKey)){
      return SECP256K1Client.derivePublicKey(typeof privKey == "string" ? privKey : Buffer.from(priv, "hex").toString("hex"));
    } else {
      throw new Error('invalid private key');
    }
  }
}

export default walletJwt;