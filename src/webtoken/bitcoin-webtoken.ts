import { Alg, Chain, ISignData } from "../type";
import Secp256k1KeyPair from "../keypairs/secp256k1-keypair";
import { WebToken } from "./webtoken";
import { Point } from "@noble/secp256k1";
import * as wif from "wif"

export class BitcoinWebToken extends WebToken {
  constructor(priv: string) {
    try {
      const privOfWif = wif.decode(priv);
      priv = Buffer.from(privOfWif.privateKey).toString('hex');
    } catch (_) {}
    const point = Point.fromPrivateKey(Buffer.from(priv, "hex"));
    const keypair = new Secp256k1KeyPair({
      privateKey: priv,
      publicKey: point.toHex()
    });
    super(keypair, Chain.Bitcoin, Alg.Secp256k1);
  }

  public sign(signData: ISignData): string {
    const { usr, time } = signData;
    const data = super.payload({
      usr,
      time: time || Math.floor(new Date().getTime() / 1000)
    });
    return this.keypair.sign(data);
  }
  public verify(token: string) {
    return this.keypair.verify(token);
  }
}
