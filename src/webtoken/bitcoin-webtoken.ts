import { Alg, Chain } from "../type";
import Secp256k1KeyPair from "../keypairs/secp256k1-keypair";
import { WebToken } from "./webtoken";
import { Point } from "@noble/secp256k1";
import * as wif from "wif"

function deriveKeyPair(priv: string) {
  try {
    if(priv.length != 64){
      const privOfWif = wif.decode(priv);
      priv = Buffer.from(privOfWif.privateKey).toString('hex');
    }
    const point = Point.fromPrivateKey(Buffer.from(priv, "hex"));
    return new Secp256k1KeyPair({
      privateKey: priv,
      publicKey: point.toHex()
    });
  } catch (error) {
    throw new Error("deriving keypair requires valid private key")
  }
}

export class BitcoinWebToken extends WebToken {
  constructor(priv: string) {
    super(deriveKeyPair(priv), Chain.Bitcoin, Alg.Secp256k1);
  }
}
