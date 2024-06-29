import { BitcoinWebToken } from "./webtoken/bitcoin-webtoken";
import { EthereumWebToken } from "./webtoken/ethereum-webtoken";
import { JingtumWebToken } from "./webtoken/jingtum-webtoken";
import { WebToken } from "./webtoken/webtoken";
import { RippleWebToken } from "./webtoken/ripple-webtoken";
import { Chain, IQuickSignData } from "./type";

const Map = {
  [Chain.Bitcoin]: BitcoinWebToken,
  [Chain.Ethereum]: EthereumWebToken,
  [Chain.Jingtum]: JingtumWebToken,
  [Chain.Ripple]: RippleWebToken
};

const sign = (data: IQuickSignData): string => {
  const { chain, usr, privateKey, time, alg } = data;
  const WebToken = Map[chain];
  if (!WebToken) {
    throw new Error("Unsupported chain");
  }
  const webtoken = new WebToken(privateKey, alg);
  return webtoken.sign({
    usr,
    time
  });
};

export * from "./type";
export * from "./keypairs";

export { WebToken, BitcoinWebToken, EthereumWebToken, JingtumWebToken, RippleWebToken, sign };
