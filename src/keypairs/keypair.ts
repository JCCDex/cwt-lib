import { IKeyPair } from "../type";

export default abstract class KeyPair {
  protected privateKey: string;
  protected publicKey: string;

  constructor(keypair: IKeyPair) {
    this.privateKey = keypair.privateKey;
    this.publicKey = keypair.publicKey;
  }

  public abstract sign(data: Record<string, unknown>, format: string): string;

  public abstract getPublicPem(): string | Buffer;

  public abstract verify(token: string, format: string): boolean;
}
