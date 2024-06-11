"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wallet_1 = require("@ethereumjs/wallet");
const util_1 = require("@ethereumjs/util");
class EthWallet extends wallet_1.Wallet {
    constructor(chain, alg, key, keyType) {
        if (keyType == 'public') {
            super(undefined, Buffer.from((0, util_1.stripHexPrefix)(key), 'hex'));
            this.hexPrivatekey = undefined;
            this.hexPublickey = '04' + (0, util_1.stripHexPrefix)(this.getPublicKeyString());
        }
        else if (keyType == 'private') {
            super(Buffer.from((0, util_1.stripHexPrefix)(key), 'hex'));
            this.hexPrivatekey = (0, util_1.stripHexPrefix)(this.getPrivateKeyString());
            this.hexPublickey = '04' + (0, util_1.stripHexPrefix)(this.getPublicKeyString());
        }
        else {
            throw new Error(`${chain}: unsupported key type: ${keyType}`);
        }
        this.alg = alg;
    }
}
exports.default = EthWallet;
