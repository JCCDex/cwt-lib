"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wallet_1 = require("@swtc/wallet");
const elliptic_1 = require("elliptic");
const stripHexPrefix = (str, alg) => {
    if (typeof str !== 'string')
        throw new Error(`[stripHexPrefix] input must be type 'string', received ${typeof str}`);
    switch (alg) {
        case "ed25519":
            return str.match(/^ED[0-9A-Fa-f]*$/) ? str.slice(2) : str;
        case "secp256k1":
            return str.match(/^00[0-9A-Fa-f]*$/) ? str.slice(2) : str;
        default:
            return str;
    }
};
const wallet = (0, wallet_1.Factory)("ripple");
function getElliptic(alg) {
    if (alg == "ed25519") {
        return new elliptic_1.eddsa('ed25519');
    }
    else if (alg == "secp256k1") {
        return new elliptic_1.ec('secp256k1');
    }
    else {
        throw new Error(`${alg}: unsupported elliptic curve`);
    }
}
class RippleWallet {
    constructor(chain, alg, key, keyType) {
        this.alg = alg;
        RippleWallet.elliptic = getElliptic(alg);
        if (keyType == "public") {
            this.hexPublickey = stripHexPrefix(key, alg);
            if (this.alg == 'secp256k1') {
                this.hexPublickey = RippleWallet.elliptic.keyFromPublic(this.hexPublickey, 'hex').getPublic('hex');
            }
        }
        else if (keyType == "secret") {
            const keypair = wallet.KeyPair.deriveKeypair(key);
            this.hexPrivatekey = stripHexPrefix(keypair.privateKey, alg);
            this.hexPublickey = RippleWallet.elliptic.keyFromPublic(stripHexPrefix(keypair.publicKey, alg), 'hex').getPublic('hex');
        }
        else {
            throw new Error(`${chain}: unsupported key type: ${keyType}`);
        }
    }
    static generate(alg) {
        this.elliptic = getElliptic(alg);
        const secret_address = wallet.generate({ algorithm: alg });
        const keypair = wallet.KeyPair.deriveKeypair(secret_address.secret);
        return Object.assign(secret_address, {
            privateKey: keypair.privateKey,
            publicKey: keypair.publicKey
        });
    }
}
exports.default = RippleWallet;
