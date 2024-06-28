import { sha256 } from "@noble/hashes/sha256";
import baseCodec from "base-x";
const FAMILY_SEED = 0x21; // 33
const ED25519_SEED = [0x01, 0xe1, 0x4b]; // [1, 225, 75]

const seqEqual = (arr1, arr2): boolean => {
  if (arr1.length !== arr2.length) {
    return false;
  }

  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) {
      return false;
    }
  }
  return true;
};

class Codec {
  public sha256: (bytes: Uint8Array) => Buffer;
  public alphabet: string;
  public codec;
  public base: number;

  constructor(options: { sha256; alphabet: string }) {
    this.sha256 = options.sha256;
    this.alphabet = options.alphabet;
    this.codec = baseCodec(this.alphabet);
    this.base = this.alphabet.length;
  }

  /**
   * Decoder.
   *
   * @param base58string Base58Check-encoded string to decode.
   * @param opts Options object including the version byte(s) and the expected length of the data after decoding.
   */
  public decode(
    base58string: string,
    opts: {
      versions: (number | number[])[];
      expectedLength?: number;
      versionTypes?: string[];
    }
  ): {
    version: number[];
    bytes: Buffer;
    type: string | null;
  } {
    const versions = opts.versions;
    const types = opts.versionTypes;

    const withoutSum = this.decodeChecked(base58string);

    if (versions.length > 1 && !opts.expectedLength) {
      throw new Error("expectedLength is required because there are >= 2 possible versions");
    }
    const versionLengthGuess = typeof versions[0] === "number" ? 1 : (versions[0] as number[]).length;
    const payloadLength = opts.expectedLength || withoutSum.length - versionLengthGuess;
    const versionBytes = withoutSum.slice(0, -payloadLength);
    const payload = withoutSum.slice(-payloadLength);

    for (let i = 0; i < versions.length; i++) {
      const version: number[] = Array.isArray(versions[i]) ? (versions[i] as number[]) : [versions[i] as number];
      if (seqEqual(versionBytes, version)) {
        return {
          version,
          bytes: payload,
          type: types ? types[i] : null
        };
      }
    }

    throw new Error("version_invalid: version bytes do not match any of the provided version(s)");
  }

  public decodeChecked(base58string: string): Buffer {
    const buffer = this.decodeRaw(base58string);
    if (buffer.length < 5) {
      throw new Error("invalid_input_size: decoded data must have length >= 5");
    }
    if (!this.verifyCheckSum(buffer)) {
      throw new Error("checksum_invalid");
    }
    return buffer.slice(0, -4);
  }

  public decodeRaw(base58string: string): Buffer {
    return this.codec.decode(base58string);
  }

  public verifyCheckSum(bytes: Buffer): boolean {
    const computed = this.sha256(this.sha256(bytes.slice(0, -4))).slice(0, 4);
    const checksum = bytes.slice(-4);
    return seqEqual(computed, checksum);
  }
}

export enum Alphabet {
  Jingtum = "jpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65rkm8oFqi1tuvAxyz",
  Ripple = "rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz"
}

export const Factory = (alphabet) => {
  const codecWithAlphabet = new Codec({
    sha256: (bytes: Uint8Array) => sha256.create().update(bytes).digest(),
    alphabet
  });

  const decodeSeed = (
    seed: string,
    opts: {
      versionTypes: string[];
      versions: (number | number[])[];
      expectedLength: number;
    } = {
      versionTypes: ["ed25519", "secp256k1"],
      versions: [ED25519_SEED, FAMILY_SEED],
      expectedLength: 16
    }
  ) => {
    return codecWithAlphabet.decode(seed, opts);
  };

  return {
    decodeSeed
  };
};
