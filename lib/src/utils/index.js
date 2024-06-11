"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CHAIN_USE_KEY = exports.CHAIN_MAP = void 0;
const wallet_1 = require("../wallet");
// Bitcoin Ethereum
exports.CHAIN_MAP = new Map([
    ['ethereum', wallet_1.EthWallet],
    ['ripple', wallet_1.RippleWallet]
]);
exports.CHAIN_USE_KEY = new Map([
    ['ethereum', { sign: 'private', verify: 'public' }],
    ['ripple', { sign: 'secret', verify: 'public' }]
]);
