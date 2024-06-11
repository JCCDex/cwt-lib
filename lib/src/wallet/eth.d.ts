import { Wallet } from '@ethereumjs/wallet';
import WalletInterface from './interface/WalletInterface';
export default class EthWallet extends Wallet implements WalletInterface {
    hexPrivatekey: string | undefined;
    hexPublickey: string;
    readonly alg: string;
    constructor(chain: string, alg: string, key: string, keyType: string);
}
