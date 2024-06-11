"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../src/index"));
const wallet_1 = require("../src/wallet");
const getPem_1 = require("../src/utils/getPem");
const ethWallet = wallet_1.EthWallet.generate();
const rippleWallet_secp256k1 = wallet_1.RippleWallet.generate('secp256k1');
const rippleWallet_ed25519 = wallet_1.RippleWallet.generate('ed25519');
// 测试ChainToken的快速签名和验证
describe('quickSign and verify', () => {
    it('In Ethereum, fast cwt signature and verification', () => __awaiter(void 0, void 0, void 0, function* () {
        const ethCwt = index_1.default.quickSign(ethWallet.getPrivateKeyString(), "zhye", "ethereum", "secp256k1");
        expect(ethCwt).toBeTruthy();
        const chainToken = new index_1.default("ethereum", "secp256k1", ethWallet.getPublicKeyString(), "public");
        const result = chainToken.verify(ethCwt);
        expect(result).toBe(true);
    }));
    it('In ripple, fast cwt signature and verification', () => __awaiter(void 0, void 0, void 0, function* () {
        // ripple secp256k1
        const rippleCwt_secp256k1 = index_1.default.quickSign(rippleWallet_secp256k1.privateKey, "jc_ripple", "ripple", "secp256k1");
        expect(rippleCwt_secp256k1).toBeTruthy();
        const chainToken_secp256k1 = new index_1.default("ripple", "secp256k1", rippleWallet_secp256k1.publicKey, "public");
        const result_secp256k1 = chainToken_secp256k1.verify(rippleCwt_secp256k1);
        expect(result_secp256k1).toBe(true);
        // ripple ed25519
        const rippleCwt_ed25519 = index_1.default.quickSign(rippleWallet_ed25519.secret, "jc_ripple", "ripple", "ed25519");
        expect(rippleCwt_ed25519).toBeTruthy();
        const chainToken_ed25519 = new index_1.default("ripple", "ed25519", rippleWallet_ed25519.publicKey, "public");
        const result_ed25519 = chainToken_ed25519.verify(rippleCwt_ed25519);
        expect(result_ed25519).toBe(true);
    }));
    it("Error testing", () => __awaiter(void 0, void 0, void 0, function* () {
        expect(() => { index_1.default.quickSign(rippleWallet_ed25519.secret, "jc_ripple", "network", "ed25519"); })
            .toThrow(new Error('chain network is not supported'));
    }));
});
// 测试ChainToken的签名、解码和验证
describe('sign, decode and verify', () => {
    it('In Ethereum, cwt signature, decode and verification', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            header: {
                x5c: [
                    "*****public key*****"
                ],
                type: "CWT",
                chain: "ethereum",
            },
            payload: {
                usr: "zhye",
                time: 1718084540
            }
        };
        const privChainToken = new index_1.default("ethereum", "secp256k1", ethWallet.getPrivateKeyString(), "private");
        const cwt = privChainToken.sign(data);
        expect(cwt).toBeTruthy();
        expect(index_1.default.decode(cwt)).toBeTruthy();
        const verify = privChainToken.verify(cwt);
        expect(verify).toBe(true);
    }));
    it('In Ripple, cwt signature, decode and verification', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = {
            header: {
                x5c: [
                    "*****public key*****"
                ],
                type: "CWT",
                chain: "ripple",
            },
            payload: {
                usr: "jc_ripple",
                time: 1718084540
            }
        };
        // ripple secp256k1
        const privChainToken_secp256k1 = new index_1.default("ripple", "secp256k1", rippleWallet_secp256k1.secret, "secret");
        const cwt_secp256k1 = privChainToken_secp256k1.sign(data);
        expect(cwt_secp256k1).toBeTruthy();
        expect(index_1.default.decode(cwt_secp256k1)).toBeTruthy();
        const verify_secp256k1 = privChainToken_secp256k1.verify(cwt_secp256k1);
        expect(verify_secp256k1).toBe(true);
        // ripple ed25519
        const privChainToken_ed25519 = new index_1.default("ripple", "ed25519", rippleWallet_ed25519.secret, "secret");
        const cwt_ed25519 = privChainToken_ed25519.sign(data);
        expect(cwt_ed25519).toBeTruthy();
        expect(index_1.default.decode(cwt_ed25519)).toBeTruthy();
        const verify_ed25519 = privChainToken_ed25519.verify(cwt_ed25519);
        expect(verify_ed25519).toBe(true);
    }));
});
describe('Converts the public and private keys to pem format according to the algorithm', () => {
    it("Convert the public and private keys to pem format according to secp256k1", () => __awaiter(void 0, void 0, void 0, function* () {
        const { privateKey, publicKey } = rippleWallet_secp256k1;
        const privatePem = (0, getPem_1.getPrivatePem)(privateKey, 'secp256k1');
        expect(privatePem).toBeTruthy();
        const publicPem = (0, getPem_1.getPublicPem)(publicKey, 'secp256k1');
        expect(publicPem).toBeTruthy();
    }));
    it("Convert the public and private keys to pem format according to ed25519", () => __awaiter(void 0, void 0, void 0, function* () {
        const { privateKey, publicKey } = rippleWallet_ed25519;
        const privatePem = (0, getPem_1.getPrivatePem)(privateKey, 'ed25519');
        expect(privatePem).toBeTruthy();
        const publicPem = (0, getPem_1.getPublicPem)(publicKey, 'ed25519');
        expect(publicPem).toBeTruthy();
    }));
});
