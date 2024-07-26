import { KeyPair } from "../keypairs";

export abstract class WebToken {
  public chain: string;
  public alg: string;
  protected keypair: KeyPair;

  public constructor(keypair: KeyPair, chain: string, alg: string) {
    this.chain = chain;
    this.alg = alg;
    this.keypair = keypair;
  }

  public abstract sign(data): string;

  public abstract verify(token: string): boolean;

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
