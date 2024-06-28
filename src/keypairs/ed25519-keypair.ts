import KeyPair from "./keypair";
import { escape, encode, unescape } from "jsontokens/lib/base64Url.js";
import { IKeyPair } from "../type";
import KeyEncoder from "../key-encoder";
import { ed25519 } from "@noble/curves/ed25519";

export default class Ed25519KeyPair extends KeyPair {
  private keyEncoder: KeyEncoder;

  constructor(keypair: IKeyPair) {
    super(keypair);
    this.keyEncoder = new KeyEncoder("ed25519");
  }

  public sign(data: Record<string, unknown>): string {
    const { header, payload } = data;
    const signHeader = encode(JSON.stringify(header));
    const signPayload = encode(JSON.stringify(payload));
    const signatureBytes = ed25519.sign(Buffer.from(signHeader + "." + signPayload), this.privateKey);
    return signHeader + "." + signPayload + "." + escape(Buffer.from(signatureBytes).toString("base64"));
  }

  public getPublicPem(): string | Buffer {
    return this.keyEncoder.encodePublic(this.publicKey) + "\n";
  }

  public verify(token: string): boolean {
    const [header, payload, signature] = token.split(".");
    const signData = header + "." + payload;
    return ed25519.verify(
      Buffer.from(unescape(signature), "base64").toString("hex"),
      Buffer.from(signData),
      this.publicKey
    );
  }
}
