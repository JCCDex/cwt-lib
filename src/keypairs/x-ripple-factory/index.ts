import { Factory as AddressCodecFactory, Alphabet } from "./address-codec";
import { IKeyPair } from "../../type";
import { derivePrivateKey } from "./utils";
import { Point } from "@noble/secp256k1";
import { bytesToHex, numberToBytesBE } from "@noble/curves/abstract/utils";
import { sha512 } from "@noble/hashes/sha512";
import { ed25519 as Ed25519 } from "@noble/curves/ed25519";

const hash = (message) => {
  return sha512.create().update(message).digest().slice(0, 32);
};

const SECP256K1_PREFIX = "00";
const ED25519_PREFIX = "ED";

const Factory = (alphabet) => {
  const addressCodec = AddressCodecFactory(alphabet);
  const secp256k1 = {
    deriveKeypair: (entropy, options?): IKeyPair => {
      const derived = derivePrivateKey(entropy, options);
      const privateKey = bytesToHex(numberToBytesBE(derived, 32));
      return {
        privateKey: SECP256K1_PREFIX + privateKey,
        publicKey: Point.fromPrivateKey(privateKey).toHex(true)
      };
    },
    deriveKeypairWithPrivateKey: (rawPrivateKey: string): IKeyPair => {
      const privateKey = rawPrivateKey.toUpperCase();
      const publicKey = Point.fromPrivateKey(privateKey).toHex(true);
      return { privateKey: SECP256K1_PREFIX + privateKey, publicKey };
    }
  };

  const ed25519 = {
    deriveKeypair: (entropy): IKeyPair => {
      const rawPrivateKey = hash(entropy);
      const privateKey = bytesToHex(rawPrivateKey);
      const pub = Ed25519.getPublicKey(privateKey);
      return {
        privateKey: ED25519_PREFIX + privateKey,
        publicKey: ED25519_PREFIX + bytesToHex(pub)
      };
    },
    deriveKeypairWithPrivateKey: (rawPrivateKey: string): IKeyPair => {
      const privateKey = rawPrivateKey.toUpperCase();
      const pub = Ed25519.getPublicKey(privateKey);
      return { privateKey: ED25519_PREFIX + privateKey, publicKey: ED25519_PREFIX + bytesToHex(pub) };
    }
  };

  const deriveKeyPair = (seed: string, algorithm?: string): IKeyPair => {
    if (seed.startsWith("s")) {
      const decoded = addressCodec.decodeSeed(seed);
      if (decoded.type === "secp256k1") {
        return secp256k1.deriveKeypair(decoded.bytes);
      }
      return ed25519.deriveKeypair(decoded.bytes);
    }

    if (seed.length === 64) {
      if (algorithm === "ed25519") {
        return ed25519.deriveKeypairWithPrivateKey(seed);
      }
      return secp256k1.deriveKeypairWithPrivateKey(seed);
    }

    if (seed.length === 66) {
      if (seed.startsWith(ED25519_PREFIX)) {
        return ed25519.deriveKeypairWithPrivateKey(seed.substring(2));
      }
      return secp256k1.deriveKeypairWithPrivateKey(seed.substring(2));
    }
    throw new Error("deriving keypair requires valid private key");
  };

  return {
    deriveKeyPair
  };
};

export const JingtumKeyPair = Factory(Alphabet.Jingtum);
export const RippleKeyPair = Factory(Alphabet.Ripple);
