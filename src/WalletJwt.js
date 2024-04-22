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

    if(typeof priv == "string" && priv.toLowerCase().slice(0,2) == '0x') {
      priv = stripHexPrefix(priv);
    }
    if(this.isValidPrivate(priv)){
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
  static verify(token, pub, isCompress = true) {
    if(this.#judgeType(pub) != "String") {
      throw new Error('The public key used for verification must be a hex string');
    }
    let compressPubKey = pub;
    if(!isCompress){
      compressPubKey = this.compressPubKeyByPubKey(compressPubKey);
    }
    // 使用压缩公钥验证 jwt
    return new TokenVerifier("ES256k", compressPubKey).verify(token);
  }

  // 生成钱包
  static generate() {
    const wallet = Wallet.generate();
    return {
      privateKey: wallet.getPrivateKeyString(),
      publicKey: wallet.getPublicKeyString(),
      compressPubKey: this.compressPubKeyByPrivateKey(wallet.getPrivateKey()),
      address: wallet.getAddressString()
    }
  }

  // 通过私钥压缩公钥
  static compressPubKeyByPrivateKey(priv) {
    let privKey = priv;
    if(typeof privKey == "string" && privKey.toLowerCase().slice(0,2) == '0x') {
      privKey = stripHexPrefix(priv);
    }
 
    if(this.isValidPrivate(privKey)){
      return SECP256K1Client.derivePublicKey(typeof privKey == "string" ? privKey : Buffer.from(priv, "hex").toString("hex"));
    } else {
      throw new Error('invalid private key');
    }
  }

  // 通过公钥（未压缩）进行压缩公钥
  static compressPubKeyByPubKey(pub) {
    let pubKey = pub;
    if(typeof pubKey == "string" && pubKey.toLowerCase().slice(0,2) == '0x') {
      pubKey = stripHexPrefix(pub);
    }

    if(this.isValidPublic(pubKey)){
      if(this.#judgeType(pubKey) != "String"){
        pubKey = Buffer.from(pubKey).toString("hex");
      }
      // 判断pub的奇偶性，如果为偶数，前缀为02，如果为奇数，前缀为03
      const prefix = !this.#oddEvenHex(pubKey) ? '02' : '03';
      // 返回前缀加上pub的前64位
      return prefix + pubKey.slice(0, 64);
    } else {
      throw new Error('The public key used for compression is invalid');
    }
  }

  static #judgeType(str) {
    return Object.prototype.toString.call(str).slice(8, -1);
  }

  static isValidPrivate(str) {
    return isValidPrivate(str);
  }

  static isValidPublic(str, isCompress = false) {
    let key = str;
    const type = this.#judgeType(key);
    if(type == "String") {
      key = Buffer.from(key, "hex");
    }
    return isValidPublic(key, isCompress);
  }
   
  static #oddEvenHex(str) {
    // 获取字符串的最后一个字符，并将其转换为小写
    const last = str.toLowerCase()[127]
    // 定义一个包含奇数个数的数组
    const odd = ["1","3","5","7","9","b","d","f"];
    // 如果奇数个数的数组中包含最后一个字符，则返回true，否则返回false
    if(odd.indexOf(last) > -1) {
      return true;
    } else {
      return false;
    }
  }
}

export default WalletJwt;