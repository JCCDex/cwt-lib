import KeyPair from "./keypair";
import { escape, encode, unescape } from "jsontokens/lib/base64Url.js";
import { IKeyPair } from "../type";
import KeyEncoder from "../KeyEncoder";
import { eddsa as EdDSA } from 'elliptic'

export default class Ed25519KeyPair extends KeyPair {
  ED: EdDSA = EdDSA('ed25519');
  constructor(keypair: IKeyPair) {
    super(keypair);
  }

  public sign(data: Record<string, unknown>): string {
    const { header, payload } = data;
    const signHeader = encode(JSON.stringify(header));
    const signPayload = encode(JSON.stringify(payload));
    const signatureBytes = this.ED.sign(Buffer.from(signHeader + "." + signPayload), this.privateKey).toBytes();
    return signHeader + "." + signPayload + "." + escape(Buffer.from(signatureBytes).toString("base64"));
  }

  public getPublicPem(): string | Buffer {
    const keyEncoder = new KeyEncoder('ed25519');
    return keyEncoder.encodePublic(this.publicKey)+"\n";
  }

  public getPrivatePem(): string | Buffer {
    const keyEncoder = new KeyEncoder('ed25519');
    return keyEncoder.encodePrivate(this.privateKey)+"\n";
  }

  public verify(token: string): boolean {
    const [header, payload, signature] = token.split(".");
    const signData = header + "." + payload;
    return this.ED.verify(Buffer.from(signData), Buffer.from(unescape(signature), 'base64').toString('hex'), this.publicKey);
  }
}
