"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RippleWallet = exports.EthWallet = exports.ChainToken = void 0;
const chainToken_1 = __importDefault(require("./chainToken"));
exports.ChainToken = chainToken_1.default;
const wallet_1 = require("./wallet");
Object.defineProperty(exports, "EthWallet", { enumerable: true, get: function () { return wallet_1.EthWallet; } });
Object.defineProperty(exports, "RippleWallet", { enumerable: true, get: function () { return wallet_1.RippleWallet; } });
