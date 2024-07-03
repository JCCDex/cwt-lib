import { sha256 } from "@noble/hashes/sha256";
import KeyPair from "./keypair";
import KeyEncoder from "../key-encoder";
import { escape, encode } from "./base64-url";
import * as secp from "@noble/secp256k1";
import { hmac } from "@noble/hashes/hmac";

import { IKeyPair, Json } from "../type";

// required to use noble secp https://github.com/paulmillr/noble-secp256k1
secp.utils.hmacSha256Sync = (key: Uint8Array, ...msgs: Uint8Array[]) => {
  const h = hmac.create(sha256, key);
  msgs.forEach((msg) => h.update(msg));
  return h.digest();
};

export default class Secp256k1KeyPair extends KeyPair {
  private keyEncoder: KeyEncoder;
  constructor(keypair: IKeyPair) {
    super(keypair);
    this.keyEncoder = new KeyEncoder("secp256k1");
  }

  private createSigningInput(payload: Json, header: Json) {
    const tokenParts = [];
    const encodedHeader = encode(JSON.stringify(header));
    tokenParts.push(encodedHeader);
    const encodedPayload = encode(JSON.stringify(payload));
    tokenParts.push(encodedPayload);
    const signingInput = tokenParts.join(".");
    return signingInput;
  }

  public sign(data): string {
    const { header, payload } = data;
    const signingInput = this.createSigningInput(payload, header);
    const signingInputHash = sha256(signingInput);
    const derSignature = secp.signSync(signingInputHash, Buffer.from(this.privateKey, "hex"), {
      der: true,
      canonical: false
    });
    const base64Signature = escape(Buffer.from(derSignature).toString("base64"));
    return [signingInput, base64Signature].join(".");
  }

  public getPublicPem(): string {
    return this.keyEncoder.encodePublic(this.publicKey);
  }

  public verify(token: string): boolean {
    const [header, payload, signature] = token.split(".");
    const signingInputHash = sha256(header + "." + payload);
    return secp.verify(Buffer.from(signature, "base64"), signingInputHash, this.publicKey, {
      strict: false
    });
  }
}
