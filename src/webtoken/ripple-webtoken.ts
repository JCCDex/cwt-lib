import { Factory } from "@swtc/keypairs";
import { Alg, Chain, ISignData, PrivateKeyFlag } from "../type";
import { KeyPair, Secp256k1KeyPair, Ed25519KeyPair } from "../keypairs";
import { Point } from "@noble/secp256k1";
import { WebToken } from "./webtoken";
const wallet = Factory(Chain.Ripple);

export class RippleWebToken extends WebToken {
  constructor(priv: string) {
    const { privateKey, publicKey } = wallet.deriveKeyPair(priv);
    const flag = privateKey.substring(0, 2);
    let keypair: KeyPair;
    let alg: Alg;
    if (flag === PrivateKeyFlag.ED) {
      keypair = new Ed25519KeyPair({
        privateKey: privateKey.substring(2),
        publicKey: publicKey.substring(2)
      });
      alg = Alg.Ed25519;
    } else {
      const point = Point.fromPrivateKey(privateKey.substring(2));
      keypair = new Secp256k1KeyPair({
        privateKey: privateKey.substring(2),
        publicKey: point.toHex()
      });
      alg = Alg.Secp256k1;
    }

    super(keypair, Chain.Ripple, alg);
  }

  public sign(signData: ISignData): string {
    const { usr, time } = signData;
    const data = super.payload({
      usr,
      time: time || Math.floor(new Date().getTime() / 1000)
    });
    return this.keypair.sign(data, "der");
  }
  public verify(token: string): boolean {
    return this.keypair.verify(token, "der");
  }
}
