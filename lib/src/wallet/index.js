"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RippleWallet = exports.EthWallet = void 0;
const eth_1 = __importDefault(require("./eth"));
exports.EthWallet = eth_1.default;
const ripple_1 = __importDefault(require("./ripple"));
exports.RippleWallet = ripple_1.default;
