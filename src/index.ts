import { BitcoinWebToken } from "./webtoken/bitcoin-webtoken";
import { EthereumWebToken } from "./webtoken/ethereum-webtoken";
import { JingtumWebToken } from "./webtoken/jingtum-webtoken";
import { WebToken } from "./webtoken/webtoken";
import { RippleWebToken } from "./webtoken/ripple-webtoken";
import { Chain } from "./type";

const chainWebTokenSign = function(chain: string, priv: string, usr: string, time?: number ,alg?: string){
  switch(chain){
    case Chain.Bitcoin:
      return new BitcoinWebToken(priv).sign({usr, time});
    case Chain.Ethereum:
      return new EthereumWebToken(priv).sign({usr, time});
    case Chain.Jingtum:
      return new JingtumWebToken(priv, alg).sign({usr, time});
    case Chain.Ripple:
      return new RippleWebToken(priv, alg).sign({usr, time});
    default:
      throw new Error("Unsupported chain");
    }
}

export * from "./type";
export * from "./keypairs";
export { WebToken, BitcoinWebToken, EthereumWebToken, JingtumWebToken, RippleWebToken, chainWebTokenSign };
