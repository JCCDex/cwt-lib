import KeyPair from "./keypair";
import * as crypto from "crypto";
import { escape, encode, unescape } from "jsontokens/lib/base64Url.js";
import { IKeyPair } from "../type";

export default class Ed25519KeyPair extends KeyPair {
  constructor(keypair: IKeyPair) {
    super(keypair);
  }

  public sign(data: Record<string, unknown>): string {
    const { header, payload } = data;
    const signHeader = encode(JSON.stringify(header));
    const signPayload = encode(JSON.stringify(payload));
    const signature = crypto.sign(null, Buffer.from(signHeader + "." + signPayload), this.getPrivatePem());
    return signHeader + "." + signPayload + "." + escape(signature.toString("base64"));
  }

  public getPublicPem(): string | Buffer {
    const der = "302a300506032b6570032100" + this.publicKey;
    const keyObj = crypto.createPublicKey({
      key: Buffer.from(der, "hex"),
      format: "der",
      type: "spki"
    });
    return keyObj.export({ type: "spki", format: "pem" });
  }

  public getPrivatePem(): string | Buffer {
    const der = "302e020100300506032b657004220420" + this.privateKey;
    const keyObj = crypto.createPrivateKey({
      key: Buffer.from(der, "hex"),
      format: "der",
      type: "pkcs8"
    });
    return keyObj.export({ type: "pkcs8", format: "pem" });
  }

  public verify(token: string): boolean {
    const [header, payload, signature] = token.split(".");
    const signData = header + "." + payload;
    const pem = this.getPublicPem();
    return crypto.verify(null, Buffer.from(signData), pem, Buffer.from(unescape(signature), "base64"));
  }
}
