/// <reference types="node" />
declare function getPrivatePem(priv: string, alg: string): string | Buffer;
declare function getPublicPem(pub: string, alg: string): string | Buffer;
export { getPrivatePem, getPublicPem };
