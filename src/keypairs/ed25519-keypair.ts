import KeyPair from "./keypair";
import { escape, encode, unescape } from "jsontokens/lib/base64Url.js";
import { IKeyPair } from "../type";
import KeyEncoder from "../key-encoder";
import { eddsa as EdDSA } from "elliptic";

export default class Ed25519KeyPair extends KeyPair {
  private ED: EdDSA;
  private keyEncoder: KeyEncoder;

  constructor(keypair: IKeyPair) {
    super(keypair);
    this.ED = EdDSA("ed25519");
    this.keyEncoder = new KeyEncoder("ed25519");
  }

  public sign(data: Record<string, unknown>): string {
    const { header, payload } = data;
    const signHeader = encode(JSON.stringify(header));
    const signPayload = encode(JSON.stringify(payload));
    const signatureBytes = this.ED.sign(Buffer.from(signHeader + "." + signPayload), this.privateKey).toBytes();
    return signHeader + "." + signPayload + "." + escape(Buffer.from(signatureBytes).toString("base64"));
  }

  public getPublicPem(): string | Buffer {
    return this.keyEncoder.encodePublic(this.publicKey) + "\n";
  }

  public getPrivatePem(): string | Buffer {
    return this.keyEncoder.encodePrivate(this.privateKey) + "\n";
  }

  public verify(token: string): boolean {
    const [header, payload, signature] = token.split(".");
    const signData = header + "." + payload;
    return this.ED.verify(
      Buffer.from(signData),
      Buffer.from(unescape(signature), "base64").toString("hex"),
      this.publicKey
    );
  }
}
