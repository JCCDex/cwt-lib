import { KeyPair } from "../keypairs";
import { IGenerateData } from "../type";

export abstract class WebToken {
  public chain: string;
  public alg: string;
  protected keypair: KeyPair;

  public constructor(keypair: KeyPair, chain: string, alg: string) {
    this.chain = chain;
    this.alg = alg;
    this.keypair = keypair;
  }

  public sign(data: Record<string, unknown>): string {
    return this.keypair.sign(data);
  }
  public verify(token: string): boolean {
    return this.keypair.verify(token);
  }

  public generateData(signData: IGenerateData) {
    const data = {
      header: {
        x5c: [this.keypair.getPublicPem()],
        type: "CWT",
        chain: this.chain,
        alg: this.alg
      },
      payload: {
        usr: signData.usr,
        time: signData.time || Math.floor(new Date().getTime() / 1000)
      }
    };

    return data;
  }
}
