import WalletInterface from "./interface/WalletInterface";
export default class RippleWallet implements WalletInterface {
    hexPrivatekey: string | undefined;
    hexPublickey: string;
    readonly alg: string;
    static elliptic: any;
    constructor(chain: string, alg: string, key: string, keyType: string);
    static generate(alg: string): any;
}
