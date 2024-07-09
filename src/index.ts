import { BitcoinWebToken } from "./webtoken/bitcoin-webtoken";
import { EthereumWebToken } from "./webtoken/ethereum-webtoken";
import { JingtumWebToken } from "./webtoken/jingtum-webtoken";
import { WebToken } from "./webtoken/webtoken";
import { RippleWebToken } from "./webtoken/ripple-webtoken";
import { Chain, IQuickSignData } from "./type";

const WebTokenMap = {
  [Chain.Bitcoin]: BitcoinWebToken,
  [Chain.Ethereum]: EthereumWebToken,
  [Chain.Jingtum]: JingtumWebToken,
  [Chain.Ripple]: RippleWebToken
};

const sign = (data: IQuickSignData): string => {
  const { chain, usr, privateKey, time, alg } = data;
  const WebToken = WebTokenMap[chain];
  if (!WebToken) {
    throw new Error("Unsupported chain");
  }
  const webtoken = new WebToken(privateKey, alg);
  const signData = webtoken.generateData({
    usr,
    time: time || Math.floor(new Date().getTime() / 1000)
  });
  return webtoken.sign(signData);
};

export * from "./type";
export * from "./keypairs";

export { WebToken, BitcoinWebToken, EthereumWebToken, JingtumWebToken, RippleWebToken, sign };
