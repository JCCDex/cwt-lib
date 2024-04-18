// 导入jsontokens库中的TokenSigner、decodeToken、TokenVerifier类
import { TokenSigner, decodeToken, TokenVerifier } from 'jsontokens'
// 导入Wallet类，用于生成钱包
import Wallet from 'ethereumjs-wallet'
// 导入publicKeyCreate函数，用于压缩公钥
import { publicKeyCreate } from 'ethereum-cryptography/secp256k1-compat';
// 导入isValidPrivate和isValidPublic函数，用于检查私钥和公钥的有效性
import { isValidPrivate, isValidPublic, } from '@ethereumjs/util'

// 定义ethWalletJwt类
class walletJwt {
  // 定义signOfjwt函数，用于签名jwt
  static signOfjwt(data, priv) {
    // 检查data中是否有header和payload
    const { header, payload } = data;
    if(!payload){
      return new Error('payload is required');
    }

    // 如果私钥不是128位，且以0x开头，则去掉0x前缀
    if(priv.length != 64 && priv.slice(0,2) == "0x") {
      priv = priv.slice(2);
    }
    // 检查私钥是否有效
    if(isValidPrivate(priv)){
      // 使用私钥签名payload，并返回签名后的jwt
      return new TokenSigner("ES256k", priv).sign(payload, false, header);
    } else {
      return new Error('invalid private key');
    }
  }

  // 定义decodeOfjwt函数，用于解码jwt
  static decodeOfjwt(token) {
    // 返回解码后的jwt
    return decodeToken(token);
  }

  // 定义verifyOfjwt函数，用于验证jwt
  static verifyOfjwt(token, pub) {
    // 使用公钥验证签名后的jwt，并返回验证结果
    return new TokenVerifier("ES256k", pub).verify(token);
  }

  // 定义generate函数，用于生成钱包
  static generate() {
    // 生成钱包，并返回生成的钱包信息
    const wallet = Wallet.generate ? Wallet.generate() : Wallet.default.generate();
    return {
      privateKey: wallet.getPrivateKeyString(),
      publicKey: wallet.getPublicKeyString(),
      compressPubKey: this.compressPubKey(wallet.getPrivateKey()),
      address: wallet.getAddressString()
    }
  }

  // 定义compressPubKey函数，用于压缩公钥
  static compressPubKey(priv) {
    let privKey = priv;
    // 如果私钥是字符串，则转换为Buffer
    if(typeof priv == 'string') {
      if(priv.length != 64 && priv.slice(0,2) == "0x") {
        priv = priv.slice(2);
      }
      privKey = Buffer.from(priv, 'hex');
    }
    // 使用私钥压缩公钥，并返回压缩后的公钥
    return Buffer.from(publicKeyCreate(privKey)).toString("hex");
  }
}

// 导出ethWalletJwt类
export default walletJwt;