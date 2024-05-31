// 0x8c9d500ba6eccb8d467891b831e8c2a4e79741ac38a36f9f67f8c53d3e439280
import EthWallet from "./wallet/eth";
import ChainToken from "./chainToken";

// const priv = "105d31c6d6b19fdac7e3873572f5e1cd787afe912344a4bf3984d94b0cbb8876";
// const cwt = ChainToken.quickSign(priv, "zhye", "ethereum")
// console.log(cwt)
// console.log(ChainToken.decode(cwt))

const wallet = EthWallet.generate();
const priv = wallet.getPrivateKeyString();
const pub = wallet.getPublicKeyString();
console.log(priv);
console.log(pub);
const cwt = ChainToken.quickSign(priv, "zhye", "ethereum")
console.log(cwt)
const pub_ct = new ChainToken("ethereum", undefined, "04" + pub.slice(2));
console.log(pub_ct.verify(cwt));
