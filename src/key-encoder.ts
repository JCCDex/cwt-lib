import * as asn1 from "asn1.js";
import { ec as EC } from "elliptic";
const BN = require("bn.js");

const octstrASN = asn1.define("octstrASN", function () {
  this.octstr();
});

const EDPrivateKey8ASN = asn1.define("EDPrivateKey8ASN", function () {
  this.seq().obj(
    this.key("version").int(),
    this.key("privateKeyAlgorithm").seq().obj(this.key("curve").objid()),
    this.key("privateKey").use(octstrASN),
    this.key("attributes").explicit(0).bitstr().optional()
  );
});

const ECPrivateKeyASN = asn1.define("ECPrivateKey", function () {
  this.seq().obj(
    this.key("version").int(),
    this.key("privateKey").octstr(),
    this.key("parameters").explicit(0).objid().optional(),
    this.key("publicKey").explicit(1).bitstr().optional()
  );
});

const ECPrivateKey8ASN = asn1.define("ECPrivateKey", function () {
  this.seq().obj(
    this.key("version").int(),
    this.key("privateKeyAlgorithm").seq().obj(this.key("ecPublicKey").objid(), this.key("curve").objid()),
    this.key("privateKey").octstr().contains(ECPrivateKeyASN),
    this.key("attributes").explicit(0).bitstr().optional()
  );
});

const ECSubjectPublicKeyInfoASN = asn1.define("ECSubjectPublicKeyInfo", function () {
  this.seq().obj(
    this.key("algorithm").seq().obj(this.key("id").objid(), this.key("curve").objid()),
    this.key("pub").bitstr()
  );
});

const EDSubjectPublicKeyInfoASN = asn1.define("EDSubjectPublicKeyInfo", function () {
  this.seq().obj(this.key("algorithm").seq().obj(this.key("curve").objid()), this.key("publicKey").bitstr());
});

interface CurveOptions {
  curveParameters: number[];
  privatePEMOptions: { label: string };
  publicPEMOptions: { label: string };
}

interface EDPrivateKeyPKCS8 {
  version;
  privateKey: Buffer;
  privateKeyAlgorithm: { curve: number[] };
}

interface PrivateKeyPKCS1 {
  version;
  privateKey: Buffer;
  parameters: number[];
  publicKey?: {
    unused: number;
    data: Buffer;
  };
}

interface ECPrivateKeyPKCS8 {
  version;
  privateKey: PrivateKeyPKCS1;
  privateKeyAlgorithm: { ecPublicKey: number[]; curve: number[] };
}

const curves: { [index: string]: CurveOptions } = {
  secp256k1: {
    curveParameters: [1, 3, 132, 0, 10],
    privatePEMOptions: { label: "EC PRIVATE KEY" },
    publicPEMOptions: { label: "PUBLIC KEY" }
  },
  ed25519: {
    curveParameters: [1, 3, 101, 112],
    privatePEMOptions: { label: "PRIVATE KEY" },
    publicPEMOptions: { label: "PUBLIC KEY" }
  }
};

export default class KeyEncoder {
  algID: number[];
  algName: string;
  options: CurveOptions;
  constructor(algName: string) {
    if (algName !== "secp256k1" && algName !== "ed25519") {
      throw new Error("Unknown curve " + algName);
    }
    this.options = curves[algName];
    this.algID = algName == "secp256k1" ? [1, 2, 840, 10045, 2, 1] : [1, 3, 6, 1, 4, 1, 11591, 4, 1];
    this.algName = algName;
  }

  edPrivateKeyObject(rawPrivateKey: string) {
    const privateKeyObject: EDPrivateKeyPKCS8 = {
      version: new BN(0),
      privateKey: octstrASN.encode(Buffer.from(rawPrivateKey, "hex"), "der"),
      privateKeyAlgorithm: {
        curve: this.options.curveParameters
      }
    };
    return privateKeyObject;
  }

  ecPrivateKeyObject(rawPrivateKey: string, rawPublicKey: string) {
    const privateKeyObject: ECPrivateKeyPKCS8 = {
      version: new BN(0),
      privateKey: {
        version: new BN(1),
        privateKey: Buffer.from(rawPrivateKey, "hex"),
        parameters: this.options.curveParameters
      },
      privateKeyAlgorithm: {
        ecPublicKey: this.algID,
        curve: this.options.curveParameters
      }
    };

    if (rawPublicKey) {
      privateKeyObject.privateKey.publicKey = {
        unused: 0,
        data: Buffer.from(rawPublicKey, "hex")
      };
    }

    return privateKeyObject;
  }

  ecPublicKeyObject(rawPublicKey: string) {
    return {
      algorithm: {
        id: this.algID,
        curve: this.options.curveParameters
      },
      pub: {
        unused: 0,
        data: Buffer.from(rawPublicKey, "hex")
      }
    };
  }

  edPublicKeyObject(rawPublicKey: string) {
    return {
      algorithm: {
        curve: this.options.curveParameters
      },
      publicKey: {
        data: Buffer.from(rawPublicKey, "hex")
      }
    };
  }

  encodePrivate(privateKey: string) {
    let publicKey: string = "";
    if (this.algName == "secp256k1") {
      const ec = new EC("secp256k1");
      const keypair = ec.keyFromPrivate(privateKey);
      publicKey = keypair.getPublic("hex");
    }
    const privateKeyObject =
      this.algName == "secp256k1"
        ? this.ecPrivateKeyObject(privateKey, publicKey)
        : this.edPrivateKeyObject(privateKey);

    if (this.algName == "secp256k1") {
      return ECPrivateKey8ASN.encode(privateKeyObject, "pem", {
        ...this.options.privatePEMOptions,
        label: "PRIVATE KEY"
      });
    } else {
      return EDPrivateKey8ASN.encode(privateKeyObject, "pem", {
        ...this.options.privatePEMOptions,
        label: "PRIVATE KEY"
      });
    }
  }

  encodePublic(publicKey: string): string {
    /* Parse the incoming public key and convert it to a public key object */
    if (typeof publicKey !== "string") {
      throw "public key must be a string";
    }
    const publicKeyObject =
      this.algName == "secp256k1" ? this.ecPublicKeyObject(publicKey) : this.edPublicKeyObject(publicKey);

    /* Export the private key object to the desired format */
    if (this.algName == "secp256k1")
      return ECSubjectPublicKeyInfoASN.encode(publicKeyObject, "pem", this.options.publicPEMOptions);
    else return EDSubjectPublicKeyInfoASN.encode(publicKeyObject, "pem", this.options.publicPEMOptions);
  }
}
