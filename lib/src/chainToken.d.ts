export default class ChainToken {
    static getAllowChain(): Iterator<string>;
    static decode(token: string): any;
    readonly chain: string;
    readonly alg: string;
    wallet: any;
    constructor(chain: string, alg: string, key: string, keyType: string);
    sign(data: {
        header: any;
        payload: any;
    }, format?: string): string;
    static quickSign(key: string, usr: string, chain: string, alg: string): string;
    verify(token: string, format?: string): boolean;
}
