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

  public payload(payload, type?: string) {
    if(type && !(typeof type == 'string' && (type === "CWT" || type === "CWT_ENT"))) {
      throw new Error("expecting 'CWT' or 'CWT_ENT' as \"type\"");
    }
    const data = {
      header: {
        x5c: [this.keypair.getPublicPem()],
        type: type || "CWT",
        chain: this.chain,
        alg: this.alg
      },
      payload
    };

    return data;
  }
}
