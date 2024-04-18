import walletJwt from "./src/walletJwt.js";

const wallet = walletJwt.generate();
console.log("generate eth account:\n", wallet);
const data = {
  header:{
    time: new Date().toString(),
  },
  payload:{
    sub: '1234567890',
    name: 'John Doe',
  }
}
console.log("\ndata:\n", data)
const sign = walletJwt.signOfjwt(data, wallet.privateKey);
console.log("\nsign content:\n",sign);
console.log("\ndecode:\n", walletJwt.decodeOfjwt(sign));
console.log("\nverify:\n", walletJwt.verifyOfjwt(sign, wallet.compressPubKey));
