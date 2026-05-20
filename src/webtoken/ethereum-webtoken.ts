import { Alg, Chain, ISignData } from "../type";
import Secp256k1KeyPair from "../keypairs/secp256k1-keypair";
import { WebToken } from "./webtoken";
import { Point } from "@noble/secp256k1";

export class EthereumWebToken extends WebToken {
  constructor(priv: string) {
    try {
      const point = Point.fromPrivateKey(Buffer.from(priv, "hex"));
      const publicKey = point.toHex();
      const keypair = new Secp256k1KeyPair({
        privateKey: priv,
        publicKey
      });
      super(keypair, Chain.Ethereum, Alg.Secp256k1);
    } catch (error) {
      throw new Error("deriving keypair requires valid private key");
    }
  }

  public sign(signData: ISignData): string {
    const { usr, group, time } = signData;
    const data = super.payload({
      usr,
      group,
      time: time || Math.floor(new Date().getTime() / 1000)
    });
    return this.keypair.sign(data);
  }
  public verify(token: string) {
    return this.keypair.verify(token);
  }
}
