import KeyPair from "./keypair";
import KeyEncoder from "key-encoder";
import { fromByteArray } from "base64-js";
import * as formatter from "ecdsa-sig-formatter";
import { TokenSigner, TokenVerifier } from "jsontokens";
import { escape } from "jsontokens/lib/base64Url";
import { IKeyPair } from "../type";

export default class Secp256k1KeyPair extends KeyPair {
  constructor(keypair: IKeyPair) {
    super(keypair);
  }

  public sign(data, format: string): string {
    const { header, payload } = data;
    const customHeader = {
      typ: undefined,
      alg: undefined,
      ...header
    };

    const token = new TokenSigner("ES256k", this.privateKey).sign(payload, false, customHeader);
    if (format === "der") {
      const [header, payload, signature] = token.split(".");
      return header + "." + payload + "." + escape(fromByteArray(formatter.joseToDer(signature, "ES256")));
    }
    if (format === "jose") {
      return token;
    }
  }

  public getPublicPem(): string {
    const keyEncode = new KeyEncoder("secp256k1");
    return keyEncode.encodePublic(this.publicKey, "raw", "pem");
  }

  public getPrivatePem(): string | Buffer {
    const keyEncode = new KeyEncoder("secp256k1");
    return keyEncode.encodePrivate(this.privateKey, "raw", "pem");
  }

  public verify(token: string, format = "der"): boolean {
    if (format === "der") {
      try {
        const [header, payload, signature] = token.split(".");
        token = header + "." + payload + "." + formatter.derToJose(signature, "ES256");
      } catch (_) {
        return false;
      }
    }
    return new TokenVerifier("ES256k", this.publicKey).verify(token);
  }
}
