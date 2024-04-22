import WalletJwt from "../src/WalletJwt.js";
import { isValidPrivate, isValidPublic } from "@ethereumjs/util";

const wallet = {
  privateKey: '0x0eba4da0401659f280944c6060c790fe14e4f517b89fd52367663549ad46f553',
  publicKey: '0x3d9c00b7e86725a004ae4fd5c0b73df5a44b5c8b78aa286de92d838bbc7ca71198d0c44c12d00ae1df33ed23b99c3970ec7dc4036001dbd5f56a0472846cfac1',
  compressPubKey: '033d9c00b7e86725a004ae4fd5c0b73df5a44b5c8b78aa286de92d838bbc7ca711',
  address: '0x0ab2385095227b33b3a9d77b6626f0c28344de41'
};

// 测试WalletJwt类的generate函数
describe('generate', () => {
  it('should generate a valid wallet', async () => {
    const wallet = WalletJwt.generate();
    expect(isValidPrivate(Buffer.from(wallet.privateKey.slice(2), "hex"))).toBe(true);
    expect(isValidPublic(Buffer.from(wallet.publicKey.slice(2), "hex"))).toBe(true);
    expect(WalletJwt.compressPubKey(wallet.privateKey)).toBe(wallet.compressPubKey);
    expect(wallet.address).toBeTruthy();
  });
});

// 测试WalletJwt类的compressPubKey函数
describe('compressPubKey', () => {
  it('should compress the public key correctly with the private key', async () => {
    const compressedPubKey = WalletJwt.compressPubKey(wallet.privateKey);
    expect(compressedPubKey).toEqual(wallet.compressPubKey);

    expect(()=>{WalletJwt.compressPubKey("123456789")}).toThrow(new Error('invalid private key'));
  });
});

// 测试WalletJwt类的sign函数
describe('sign', () => {
  it('should sign the jwt correctly', async () => {
    const data = {
      payload: {
        key: 'value'
      },
      header: {
        alg: 'ES256k'
      }
    };
    const jwt = WalletJwt.sign(data, wallet.privateKey);
    expect(jwt).toBeTruthy();

    expect(()=>{WalletJwt.sign({}, wallet.privateKey)}).toThrow(new Error('payload is required'));
    expect(()=>{WalletJwt.sign(data, "123456789")}).toThrow(new Error('invalid private key'));
  });
});

// 测试WalletJwt类的decode函数
describe('decode', () => {
  it('should decode the jwt correctly', async () => {
    const jwt = WalletJwt.sign({
      payload: {
        key: 'value'
      },
      header: {
        alg: 'ES256k'
      }
    }, wallet.privateKey);
    const decodedJwt = WalletJwt.decode(jwt);
    expect(decodedJwt).toBeTruthy();
  });
});

// 测试WalletJwt类的verify函数
describe('verify', () => {
  it('should verify the signed jwt correctly', async () => {
    const jwt = WalletJwt.sign({
      payload: {
        key: 'value'
      },
      header: {
        alg: 'ES256k'
      }
    }, wallet.privateKey);
    const isVerified = WalletJwt.verify(jwt, wallet.compressPubKey);
    expect(isVerified).toBeTruthy();
    const isVerified2 = WalletJwt.verify(jwt, wallet.publicKey);
    expect(isVerified2).toBeTruthy();

    expect(()=>{WalletJwt.verify(jwt, {})}).toThrow(new Error('The public key used for verification must be a hex string'));
    expect(()=>{WalletJwt.verify(jwt, "123")}).toThrow(new Error('invalid public key'));
  });
});
