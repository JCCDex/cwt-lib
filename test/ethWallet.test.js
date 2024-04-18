import walletJwt from "../src/walletJwt.js";
import { isValidPrivate, isValidPublic } from "@ethereumjs/util";

// 测试walletJwt类的generate函数
describe('generate', () => {
  it('should generate a valid wallet', async () => {
    const wallet = walletJwt.generate();
    expect(isValidPrivate(Buffer.from(wallet.privateKey.slice(2), "hex"))).toBe(true);
    expect(isValidPublic(Buffer.from(wallet.publicKey.slice(2), "hex"))).toBe(true);
    expect(walletJwt.compressPubKey(wallet.privateKey)).toBe(wallet.compressPubKey);
    expect(wallet.address).toBeTruthy();
  });
});

// 测试walletJwt类的compressPubKey函数
describe('compressPubKey', () => {
  it('should compress the public key correctly', async () => {
    const wallet = walletJwt.generate();
    const compressedPubKey = walletJwt.compressPubKey(wallet.privateKey);
    expect(compressedPubKey).toHaveLength(66);
  });
});

// 测试walletJwt类的signOfjwt函数
describe('signOfjwt', () => {
  it('should sign the jwt correctly', async () => {
    const data = {
      payload: {
        key: 'value'
      },
      header: {
        alg: 'ES256k'
      }
    };
    const wallet = walletJwt.generate();
    const jwt = walletJwt.signOfjwt(data, wallet.privateKey);
    expect(jwt).toBeTruthy();

    const errorJwt_noPayload = walletJwt.signOfjwt({}, wallet.privateKey);
    expect(errorJwt_noPayload).toEqual(new Error('payload is required'));
    const errorJwt_invalidKey = walletJwt.signOfjwt(data, "123456789");
    expect(errorJwt_invalidKey).toEqual(new Error('invalid private key'));
  });
});

// 测试walletJwt类的decodeOfjwt函数
describe('decodeOfjwt', () => {
  it('should decode the jwt correctly', async () => {
    const wallet = walletJwt.generate();
    const jwt = walletJwt.signOfjwt({
      payload: {
        key: 'value'
      },
      header: {
        alg: 'ES256k'
      }
    }, wallet.privateKey);
    const decodedJwt = walletJwt.decodeOfjwt(jwt);
    expect(decodedJwt).toBeTruthy();
  });
});

// 测试walletJwt类的verifyOfjwt函数
describe('verifyOfjwt', () => {
  it('should verify the signed jwt correctly', async () => {
    const wallet = walletJwt.generate();
    const jwt = walletJwt.signOfjwt({
      payload: {
        key: 'value'
      },
      header: {
        alg: 'ES256k'
      }
    }, wallet.privateKey);
    const isVerified = walletJwt.verifyOfjwt(jwt, wallet.compressPubKey);
    expect(isVerified).toBeTruthy();
  });
});
