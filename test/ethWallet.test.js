import WalletCwt from "../src/WalletCwt.js";
import { isValidPrivate, isValidPublic } from "@ethereumjs/util";

const wallet = {
  privateKey: '0x0eba4da0401659f280944c6060c790fe14e4f517b89fd52367663549ad46f553',
  publicKey: '0x3d9c00b7e86725a004ae4fd5c0b73df5a44b5c8b78aa286de92d838bbc7ca71198d0c44c12d00ae1df33ed23b99c3970ec7dc4036001dbd5f56a0472846cfac1',
  compressPubKey: '033d9c00b7e86725a004ae4fd5c0b73df5a44b5c8b78aa286de92d838bbc7ca711',
  address: '0x0ab2385095227b33b3a9d77b6626f0c28344de41'
};

// 测试WalletCwt类的generate函数
describe('generate', () => {
  it('should generate a valid wallet', async () => {
    const wallet = WalletCwt.generate();
    expect(isValidPrivate(Buffer.from(wallet.privateKey.slice(2), "hex"))).toBe(true);
    expect(isValidPublic(Buffer.from(wallet.publicKey.slice(2), "hex"))).toBe(true);
    expect(WalletCwt.compressPubKey(wallet.privateKey)).toBe(wallet.compressPubKey);
    expect(wallet.address).toBeTruthy();
  });
});

// 测试WalletCwt类的compressPubKey函数
describe('compressPubKey', () => {
  it('should compress the public key correctly with the private key', async () => {
    const compressedPubKey = WalletCwt.compressPubKey(wallet.privateKey);
    expect(compressedPubKey).toEqual(wallet.compressPubKey);

    expect(()=>{WalletCwt.compressPubKey("123456789")}).toThrow(new Error('invalid private key'));
  });
});

// 测试WalletCwt类的sign函数
describe('sign', () => {
  it('should sign the cwt correctly', async () => {
    const data = {
      payload: {
        key: 'value'
      },
      header: {
        alg: 'ES256k'
      }
    };
    const cwt = WalletCwt.sign(data, wallet.privateKey);
    expect(cwt).toBeTruthy();
    const cwtDer = WalletCwt.sign(data, wallet.privateKey, 'der');
    expect(cwtDer).toBeTruthy();

    expect(()=>{WalletCwt.sign(data, wallet.privateKey, 123)}).toThrow(new Error('format must be jose or der,saw 123'));
    expect(()=>{WalletCwt.sign({}, wallet.privateKey)}).toThrow(new Error('The signature content must contain header and payload.'));
    expect(()=>{WalletCwt.sign({payload: {test: 123}}, wallet.privateKey)}).toThrow(new Error('The signature content must contain header and payload.'));
    expect(()=>{WalletCwt.sign({header: {test: 123}}, wallet.privateKey)}).toThrow(new Error('The signature content must contain header and payload.'));
    expect(()=>{WalletCwt.sign(data, "123456789")}).toThrow(new Error('invalid private key'));
  });
});

// 测试WalletCwt类的decode函数
describe('decode', () => {
  it('should decode the cwt correctly', async () => {
    const cwt = WalletCwt.sign({
      payload: {
        key: 'value'
      },
      header: {
        alg: 'ES256k'
      }
    }, wallet.privateKey);
    const decodedcwt = WalletCwt.decode(cwt);
    expect(decodedcwt).toBeTruthy();
  });
});

// 测试WalletCwt类的verify函数
describe('verify', () => {
  it('should verify the signed cwt correctly', async () => {
    const data = {
      payload: {
        key: 'value'
      },
      header: {
        alg: 'ES256k'
      }
    };
    const cwt = WalletCwt.sign(data, wallet.privateKey);
    const cwtDer = WalletCwt.sign(data, wallet.privateKey, 'der');
    const isVerified = WalletCwt.verify(cwt, wallet.compressPubKey);
    expect(isVerified).toBeTruthy();
    const isVerified2 = WalletCwt.verify(cwtDer, wallet.publicKey, 'der');
    expect(isVerified2).toBeTruthy();

    expect(()=>{WalletCwt.verify(cwt, {})}).toThrow(new Error('The public key used for verification must be a hex string'));
    expect(()=>{WalletCwt.verify(cwt, "123")}).toThrow(new Error('invalid public key'));
    expect(()=>{WalletCwt.verify(cwt, wallet.publicKey, "123")}).toThrow(new Error('format must be jose or der,saw 123'));
  });
});

// 测试WalletCwt类的pubToPem和privToPem函数
describe('conversion', () => {
  it('output the public and private keys in pem format', async () => {
    const privPem = WalletCwt.privToPem(wallet.privateKey);
    expect(privPem).toBeTruthy();
    const pubPem = WalletCwt.pubToPem("0x04" + wallet.publicKey.slice(2));
    expect(pubPem).toBeTruthy();

    expect(()=>{WalletCwt.privToPem("123")}).toThrow(new Error('invalid private key'));
    expect(()=>{WalletCwt.pubToPem(wallet.compressPubKey)}).toThrow(new Error('Invalid uncompressed public key'));
  });
})

// 测试WalletCwt类的cwtSign函数
describe('cwtSign', () => {
  it('should sign the cwt correctly', async () => {
    const cwt = WalletCwt.cwtSign(wallet.privateKey, "zhye", "ethereum");
    expect(cwt).toBeTruthy();
    
    expect(()=>{WalletCwt.cwtSign("123", "zhye", "ethereum")}).toThrow(new Error('invalid private key'));
    expect(()=>{WalletCwt.cwtSign()}).toThrow(new Error('private, usr and chain cannot be empty'));
  })
})
