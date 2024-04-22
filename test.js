import WalletJwt from "./index.js";

const wallet = WalletJwt.generate();
console.log(wallet);
const data = {
    header:{
      time: new Date().toString(),
    },
    payload:{
      sub: '1234567890',
      name: 'John Doe',
    }
  };

const sign = WalletJwt.sign(data, wallet.privateKey);
console.log(sign);
console.log(WalletJwt.decode(sign));

// Verification by using a compressed public key
console.log(WalletJwt.verify(sign, wallet.compressPubKey));
// Verification by using a public key (uncompressed)
console.log(WalletJwt.verify(sign, wallet.publicKey, false));
