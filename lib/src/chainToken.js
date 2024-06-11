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
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const jsontokens_1 = require("jsontokens");
const base64Url_js_1 = require("jsontokens/lib/base64Url.js");
const base64_js_1 = require("base64-js");
const formatter = __importStar(require("ecdsa-sig-formatter"));
const getPem_1 = require("./utils/getPem");
const crypto = __importStar(require("crypto"));
function getChainWallet(chain, alg, key, keyType) {
    if (utils_1.CHAIN_MAP.has(chain)) {
        const walletClass = utils_1.CHAIN_MAP.get(chain);
        if (walletClass) {
            return new walletClass(chain, alg, key, keyType);
        }
    }
    else {
        throw new Error(`chain ${chain} is not supported`);
    }
}
class ChainToken {
    static getAllowChain() {
        return utils_1.CHAIN_MAP.keys();
    }
    static decode(token) {
        return (0, jsontokens_1.decodeToken)(token);
    }
    constructor(chain, alg, key, keyType) {
        this.chain = chain;
        this.alg = alg;
        this.wallet = getChainWallet(chain, alg, key, keyType);
    }
    sign(data, format = "der") {
        if (!this.wallet.hexPrivatekey)
            throw new Error("The private key cannot be obtained");
        const { header, payload } = data;
        if (!header || !payload)
            throw new Error("header or payload is not defined");
        switch (this.alg) {
            case "secp256k1":
                if (format != 'der' && format != 'jose')
                    throw new Error(`${this.alg}: format ${format} is not supported`);
                const abjustHeader = Object.assign({ typ: undefined, alg: undefined }, header);
                const token = new jsontokens_1.TokenSigner("ES256k", this.wallet.hexPrivatekey).sign(payload, false, abjustHeader);
                if (format == 'der') {
                    const tokenList = token.split(".");
                    return tokenList[0] + "." + tokenList[1] + "." + (0, base64Url_js_1.escape)((0, base64_js_1.fromByteArray)(formatter.joseToDer(tokenList[2], "ES256")));
                }
                else if (format == 'jose') {
                    return token;
                }
            case "ed25519":
                if (format != 'der')
                    throw new Error(`${this.alg}: format ${format} is not supported`);
                const signHeader = (0, base64Url_js_1.encode)(JSON.stringify(header));
                const signPayload = (0, base64Url_js_1.encode)(JSON.stringify(payload));
                const signature = crypto.sign(null, Buffer.from(signHeader + "." + signPayload), (0, getPem_1.getPrivatePem)(this.wallet.hexPrivatekey, this.alg));
                return signHeader + "." + signPayload + "." + (0, base64Url_js_1.escape)(signature.toString("base64"));
            default:
                throw new Error(`alg ${this.alg} is not supported`);
        }
    }
    static quickSign(key, usr, chain, alg) {
        if (!utils_1.CHAIN_USE_KEY.has(chain)) {
            throw new Error(`chain ${chain} is not supported`);
        }
        const tokenItem = new ChainToken(chain, alg, key, utils_1.CHAIN_USE_KEY.get(chain).sign);
        const data = {
            header: {
                x5c: [(0, getPem_1.getPublicPem)(tokenItem.wallet.hexPublickey, alg)],
                type: 'CWT',
                chain: chain,
            },
            payload: {
                usr: usr,
                time: Math.floor(new Date().getTime() / 1000)
            }
        };
        return tokenItem.sign(data);
    }
    verify(token, format = "der") {
        let handleToken = token;
        switch (this.alg) {
            case "secp256k1":
                if (format == 'der') {
                    const tokenList = token.split(".");
                    handleToken = tokenList[0] + "." + tokenList[1] + "." + formatter.derToJose(tokenList[2], 'ES256');
                }
                else if (format != 'jose') {
                    throw new Error(`${this.alg}: format ${format} is not supported`);
                }
                return new jsontokens_1.TokenVerifier("ES256k", this.wallet.hexPublickey).verify(handleToken);
            case "ed25519":
                if (format != 'der') {
                    throw new Error(`${this.alg}: format ${format} is not supported`);
                }
                const tokenList = token.split(".");
                const signData = tokenList[0] + "." + tokenList[1];
                return crypto.verify(null, Buffer.from(signData), (0, getPem_1.getPublicPem)(this.wallet.hexPublickey, this.alg), Buffer.from((0, base64Url_js_1.unescape)(tokenList[2]), 'base64'));
            default:
                throw new Error(`alg ${this.alg} is not supported`);
        }
    }
}
exports.default = ChainToken;
