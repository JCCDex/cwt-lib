import { KeyPair } from "../keypairs";
import { ISignData } from "../type";

export abstract class WebToken {
  public chain: string;
  public alg: string;
  protected keypair: KeyPair;

  public constructor(keypair: KeyPair, chain: string, alg: string) {
    this.chain = chain;
    this.alg = alg;
    this.keypair = keypair;
  }

  public sign(signData: ISignData): string {
    const { usr, time } = signData;
    const data = this.payload({
      usr,
      time: time || Math.floor(new Date().getTime() / 1000)
    });
    return this.keypair.sign(data);
  }
  public verify(token: string): boolean {
    return this.keypair.verify(token);
  }

  public payload(payload) {
    const data = {
      header: {
        x5c: [this.keypair.getPublicPem()],
        type: "CWT",
        chain: this.chain,
        alg: this.alg
      },
      payload
    };

    return data;
  }
}
