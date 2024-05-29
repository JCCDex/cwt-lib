// 0x8c9d500ba6eccb8d467891b831e8c2a4e79741ac38a36f9f67f8c53d3e439280
import EthWallet from "./wallet/eth";

const eth = new EthWallet("0x8c9d500ba6eccb8d467891b831e8c2a4e79741ac38a36f9f67f8c53d3e439280");
console.log(eth.getPrivateKeyString());
const newEth = EthWallet.generate();
console.log(newEth.getPrivateKeyString());