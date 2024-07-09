import { Alg, Chain } from "../type";
import Secp256k1KeyPair from "../keypairs/secp256k1-keypair";
import { WebToken } from "./webtoken";
import { Point } from "@noble/secp256k1";

export class EthereumWebToken extends WebToken {
  constructor(priv: string) {
    const point = Point.fromPrivateKey(Buffer.from(priv, "hex"));
    const publicKey = point.toHex();
    const keypair = new Secp256k1KeyPair({
      privateKey: priv,
      publicKey
    });
    super(keypair, Chain.Ethereum, Alg.Secp256k1);
  }
}
