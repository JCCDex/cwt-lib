import { Alg, Chain, PrivateKeyFlag } from "../type";
import { KeyPair, Secp256k1KeyPair, Ed25519KeyPair } from "../keypairs";
import { WebToken } from "./webtoken";
import { RippleKeyPair } from "../keypairs/x-ripple-factory";

export class RippleWebToken extends WebToken {
  constructor(priv: string, algorithm?: string) {
    const { privateKey, publicKey } = RippleKeyPair.deriveKeyPair(priv, algorithm);
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
      keypair = new Secp256k1KeyPair({
        privateKey: privateKey.substring(2),
        publicKey
      });
      alg = Alg.Secp256k1;
    }

    super(keypair, Chain.Ripple, alg);
  }
}
