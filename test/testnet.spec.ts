import axios from "axios";
import * as colors from "colors";
import { EthereumWebToken, BitcoinWebToken, JingtumWebToken, RippleWebToken, WebToken } from "../src";

type ICase = [string, WebToken];

const cases: ICase[] = [
  ["jingtum_secp256k1", new JingtumWebToken("sajoigynKobrB8U59g1puxu8GM7Hg")],
  ["jingtum_ed25519", new JingtumWebToken("sEdVrj9hBjNTPGnm4qN4iVXSQv7KMzB")],
  ["ripple_secp256k1", new RippleWebToken("snhfP8ByWeWKWYNWBnr2avbxGCZwt")],
  ["ripple_ed25519", new RippleWebToken("sEdTSMh6UwzwexTFEkyvXc5bxWzTs2n")],
  ["bitcoin_secp256k1", new BitcoinWebToken("b9d70b775092fc32eea9868c719eda3dbc8e11fae28be95e0a5bd6bf432d3732")],
  ["zhye", new EthereumWebToken("105d31c6d6b19fdac7e3873572f5e1cd787afe912344a4bf3984d94b0cbb8876")]
];

const fetch = async (cwt?: string) => {
  const config = {
    method: "post",
    url: "http://192.168.66.254:50500/",
    headers: {
      cwt_auth: cwt
    },
    data: {
      method: "server_info",
      params: [{}]
    }
  };
  const res = await axios(config);
  return res;
};
(async () => {
  try {
    await fetch();
    console.log(colors.red("server doesn't verify auth"));
    return;
  } catch (error) {
    console.log(colors.green("server verify auth: " + error.message));
  }

  for (const c of cases) {
    const [usr, webToken] = c;
    const payload = {
      usr
    };
    const cwt = webToken.sign(payload);
    try {
      await fetch(cwt);
      console.log(colors.green(`auth success on ${usr}`));
    } catch (_) {
      console.error(colors.red(`auth error on ${usr}`));
    }
  }
})();
