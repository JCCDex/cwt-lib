import { CHAIN_MAP, CHAIN_USE_KEY } from "./utils";
import { TokenSigner, decodeToken, TokenVerifier, SECP256K1Client, Json } from 'jsontokens'
import { escape, encode, decode, unescape } from 'jsontokens/lib/base64Url.js'
import { fromByteArray } from 'base64-js';
import * as formatter from "ecdsa-sig-formatter"
import { getPrivatePem, getPublicPem} from "./utils/getPem";
import * as crypto from 'crypto'

function getChainWallet(chain: string, alg: string, key: string, keyType: string): any {
  if(CHAIN_MAP.has(chain)){
    const walletClass = CHAIN_MAP.get(chain);
    if(walletClass) {
      return new walletClass(chain, alg, key, keyType);
    }
  }else {
    throw new Error(`chain ${chain} is not supported`);
  }
}

function getAlg(chain: string, key: string, keyType: string, guomi:boolean = false): string {
  switch(chain){
    case 'bitcoin':
    case "ethereum":
      return "secp256k1";
    case "jingtum":
    case "ripple":
      if(guomi)
        throw new Error(`${chain}: guomi does not support it yet`);
      if(keyType == "secret") {
        if(key.slice(0,3) == 'sEd')
          return "ed25519";
        else
          return "secp256k1";
      }else{
        if(key.slice(0,2) == 'ED')
          return "ed25519";
        else
          return "secp256k1";
      }
    default:
      throw new Error(`chain ${chain} is not supported`);
  }
}

export default class ChainToken {
  static getAllowChain(): Iterator<string> {
    return CHAIN_MAP.keys();
  }

  static decode(token: string): any {
    return decodeToken(token);
  }

  readonly chain: string
  readonly alg: string
  wallet: any;
  constructor (chain: string, key: string, keyType: string){
    this.chain = chain;
    this.alg = getAlg(chain, key, keyType);
    this.wallet = getChainWallet(chain, this.alg, key, keyType);
  }

  public sign(data: {header: any, payload: any}, format: string = "der"): string {
    if(!this.wallet.hexPrivatekey)
      throw new Error("The private key cannot be obtained");
    const { header, payload } = data;
    if(!header || !payload)
      throw new Error("header or payload is not defined");
    switch(this.alg){
      case "secp256k1":
        if(format != 'der' && format != 'jose')
          throw new Error(`${this.alg}: format ${format} is not supported`);
        const abjustHeader = Object.assign({typ: undefined, alg: undefined}, header);
        const token = new TokenSigner("ES256k", this.wallet.hexPrivatekey).sign(payload, false, abjustHeader);
        if (format == 'der') {
          const tokenList = token.split(".");
          return tokenList[0] + "." + tokenList[1] + "." + escape(fromByteArray(formatter.joseToDer(tokenList[2], "ES256")));
        }else if (format == 'jose') {
          return token;
        }
      case "ed25519":
        if(format != 'der')
          throw new Error(`${this.alg}: format ${format} is not supported`);
        const signHeader = encode(JSON.stringify(header));
        const signPayload = encode(JSON.stringify(payload));
        const signature = crypto.sign(null, Buffer.from(signHeader + "." + signPayload), getPrivatePem(this.wallet.hexPrivatekey, this.alg));
        return signHeader + "." + signPayload + "." + escape(signature.toString("base64"));
      default:
        throw new Error(`alg ${this.alg} is not supported`);
    }
  }

  static quickSign(key: string, usr: string, chain: string): string {
    if(!CHAIN_USE_KEY.has(chain)){
      throw new Error(`chain ${chain} is not supported`);
    }
    const alg = getAlg(chain, key, CHAIN_USE_KEY.get(chain).sign);
    const tokenItem = new ChainToken(chain, key, CHAIN_USE_KEY.get(chain).sign);
    const data = {
      header: {
        x5c: [getPublicPem(tokenItem.wallet.hexPublickey, alg)],
        type: 'CWT',
        chain: chain,
        alg: alg
      },
      payload: {
        usr: usr,
        time: Math.floor(new Date().getTime() / 1000)
      }
    }
    return tokenItem.sign(data);
  }

  verify(token: string, format: string = "der"): boolean {
    let handleToken = token;
    switch(this.alg) {
      case "secp256k1":
        if(format == 'der'){
          try {
            const tokenList = token.split(".");
            handleToken = tokenList[0] + "." + tokenList[1] + "." + formatter.derToJose(tokenList[2], 'ES256');
          } catch (error) {
            return false;
          }
        }else if(format != 'jose'){
          throw new Error(`${this.alg}: format ${format} is not supported`);
        }
        return new TokenVerifier("ES256k", this.wallet.hexPublickey).verify(handleToken);
      case "ed25519":
        if(format != 'der'){
          throw new Error(`${this.alg}: format ${format} is not supported`);
        }
        const tokenList = token.split(".");
        const signData = tokenList[0] + "." + tokenList[1];
          return crypto.verify(null, Buffer.from(signData), getPublicPem(this.wallet.hexPublickey, this.alg), Buffer.from(unescape(tokenList[2]), 'base64'));
      default:
        throw new Error(`alg ${this.alg} is not supported`);
    }
  }
}