"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicPem = exports.getPrivatePem = void 0;
const key_encoder_1 = __importDefault(require("key-encoder"));
const crypto = __importStar(require("crypto"));
function getPrivatePem(priv, alg) {
    switch (alg) {
        case "secp256k1":
            const keyEncode = new key_encoder_1.default('secp256k1');
            return keyEncode.encodePrivate(priv, 'raw', 'pem');
        case "ed25519":
            const der = "302e020100300506032b657004220420" + priv;
            const keyObj = crypto.createPrivateKey({
                key: Buffer.from(der, 'hex'),
                format: 'der',
                type: 'pkcs8'
            });
            return keyObj.export({ type: 'pkcs8', format: 'pem' });
        default:
            throw new Error(`Unsupported algorithm: ${alg}`);
    }
}
exports.getPrivatePem = getPrivatePem;
function getPublicPem(pub, alg) {
    switch (alg) {
        case "secp256k1":
            let pubKey = pub;
            pubKey = pubKey.length == 130 && pubKey.startsWith("04") ? pubKey : "04" + pubKey;
            const keyEncode = new key_encoder_1.default('secp256k1');
            return keyEncode.encodePublic(pubKey, 'raw', 'pem');
        case "ed25519":
            const der = "302a300506032b6570032100" + pub;
            const keyObj = crypto.createPublicKey({
                key: Buffer.from(der, 'hex'),
                format: 'der',
                type: 'spki'
            });
            return keyObj.export({ type: 'spki', format: 'pem' });
        default:
            throw new Error(`Unsupported algorithm: ${alg}`);
    }
}
exports.getPublicPem = getPublicPem;
