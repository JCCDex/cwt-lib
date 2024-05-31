import KeyEncoder from "key-encoder";
import { chainMap } from "./utils";
import { TokenSigner, decodeToken, TokenVerifier, SECP256K1Client, Json } from 'jsontokens'
import { escape } from 'jsontokens/lib/base64Url.js'
import { fromByteArray } from 'base64-js';
import * as formatter from "ecdsa-sig-formatter"

function getChainWallet(chain: string, priv: string | undefined, pub: string | undefined = undefined): any {
  if(chainMap.has(chain)){
    const walletClass = chainMap.get(chain);
    if(walletClass) {
      return new walletClass(priv, pub);
    }
  }else {
    throw new Error(`chain ${chain} is not supported`);
  }
}

export default class ChainToken {
  static privateKeyToPem(privateKey: string): string {
    const keyEncode = new KeyEncoder('secp256k1');
    return keyEncode.encodePrivate(privateKey, 'raw', 'pem');
  }

  static publicKeyToPem(publicKey: string): string {
    const keyEncode = new KeyEncoder('secp256k1');
    return keyEncode.encodePublic("04" + publicKey, 'raw', 'pem');
  }

  static getAllowChain(): Iterator<string> {
    return chainMap.keys();
  }

  static decode(token: string): any {
    return decodeToken(token);
  }

  readonly chain: string
  wallet: any;
  constructor (chain: string, priv: string | undefined, pub: string | undefined = undefined){
    this.chain = chain;
    this.wallet = getChainWallet(chain, priv, pub);
  }

  public sign(data: {header: Json, payload: Json}, format: string = "der"): string {
    if(!this.wallet.hexPrivatekey)
      throw new Error("The private key cannot be obtained");
    const { header, payload } = data;
    if(!header || !payload)
      throw new Error("header or payload is not defined");
    const abjustHeader = Object.assign({typ: undefined, alg: undefined}, header);
    const token = new TokenSigner("ES256k", this.wallet.hexPrivatekey).sign(payload, false, abjustHeader);
    if (format == 'der') {
      const tokenList = token.split(".");
      return tokenList[0] + "." + tokenList[1] + "." + escape(fromByteArray(formatter.joseToDer(tokenList[2], "ES256")));
    }else if (format == 'jose') {
      return token;
    }
    throw new Error(`format ${format} is not supported`);
  }

  static quickSign(priv: string, usr: string, chain: string): string {
    const tokenItem = new ChainToken(chain, priv);
    const data = {
      header: {
        x5c: [ChainToken.publicKeyToPem(tokenItem.wallet.hexPublickey)],
        type: 'CWT',
        chain: chain,
      },
      payload: {
        usr: usr,
        time: Math.floor(new Date().getTime() / 1000)
      }
    }
    return tokenItem.sign(data);
  }

  verify(token: string, format: string = "der"): boolean {
    const pubKey = "04" + this.wallet.hexPublickey;
    if(format == 'jose') {
      return new TokenVerifier("ES256k", pubKey).verify(token);
    }else if (format == 'der') {
      const tokenList = token.split(".");
      const handleToken = tokenList[0] + "." + tokenList[1] + "." + formatter.derToJose(tokenList[2], 'ES256');
      return new TokenVerifier("ES256k", pubKey).verify(handleToken);
    }else {
      throw new Error(`format ${format} is not supported`);
    }
  }
}