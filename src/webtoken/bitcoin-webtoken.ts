import { Alg, Chain, ISignData } from "../type";
import Secp256k1KeyPair from "../keypairs/secp256k1-keypair";
import { WebToken } from "./webtoken";
import * as bitcoin from "bitcoinjs-lib";
import ECPairFactory from "ecpair";
import * as ecc from "@bitcoinerlab/secp256k1";
import { ec as EC } from "elliptic";

const network = bitcoin.networks.bitcoin;
const ECPair = ECPairFactory(ecc);
const ec = new EC("secp256k1");

export class BitcoinWebToken extends WebToken {
  constructor(priv: string) {
    const keyPairInstance = ECPair.fromPrivateKey(Buffer.from(priv, "hex"), { network });
    const privateKey = keyPairInstance.privateKey?.toString("hex");
    const pub = ec.keyFromPublic(keyPairInstance.publicKey?.toString("hex"), "hex").getPublic("hex");
    const keypair = new Secp256k1KeyPair({
      privateKey,
      publicKey: pub
    });
    super(keypair, Chain.Bitcoin, Alg.Secp256k1);
  }

  public sign(signData: ISignData): string {
    const { usr, time } = signData;
    const data = super.payload({
      usr,
      time: time || Math.floor(new Date().getTime() / 1000)
    });
    return this.keypair.sign(data, "der");
  }
  public verify(token: string) {
    return this.keypair.verify(token, "der");
  }
}
