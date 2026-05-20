import axios from "axios";
import chalk from "chalk";
import { EthereumWebToken, BitcoinWebToken, JingtumWebToken, RippleWebToken, WebToken } from "../src";

type ICase = [{usr?: string, group?: string}, WebToken, string];

const cases: ICase[] = [
  [{usr: "jingtum_secp256k1"}, new JingtumWebToken("shNhYSvW3rYgXyhPSMsPyTE9FpSf3"), "jingtum_secp256k1"],
  [{usr: "jingtum_ed25519"}, new JingtumWebToken("sEdVmyqoq2ZhZEQdUtBGCexBAhE7Dof"), "jingtum_ed25519"],
  [{usr: "ripple_secp256k1"}, new RippleWebToken("snhfP8ByWeWKWYNWBnr2avbxGCZwt"), "ripple_secp256k1"],
  [{usr: "ripple_ed25519"}, new RippleWebToken("sEdTSMh6UwzwexTFEkyvXc5bxWzTs2n"), "ripple_ed25519"],
  [{usr: "bitcoin_secp256k1"}, new BitcoinWebToken("c9e8b15186a9be25070edd4a3bf7b261ba50a28317783dea2adf99693ae3009d"), "bitcoin"],
  [{usr: "ethereum_secp256k1"}, new EthereumWebToken("105d31c6d6b19fdac7e3873572f5e1cd787afe912344a4bf3984d94b0cbb8876"), "ethereum"],
  [{group: "jingchang"}, new JingtumWebToken("shNhYSvW3rYgXyhPSMsPyTE9FpSf3"), "jingtum_secp256k1"],
  [{group: "jingchang"}, new JingtumWebToken("sEdVmyqoq2ZhZEQdUtBGCexBAhE7Dof"), "jingtum_ed25519"],
  [{group: "jingchang"}, new RippleWebToken("snhfP8ByWeWKWYNWBnr2avbxGCZwt"), "ripple_secp256k1"],
  [{group: "jingchang"}, new RippleWebToken("sEdTSMh6UwzwexTFEkyvXc5bxWzTs2n"), "ripple_ed25519"],
  [{group: "jingchang"}, new BitcoinWebToken("c9e8b15186a9be25070edd4a3bf7b261ba50a28317783dea2adf99693ae3009d"), "bitcoin"],
  [{group: "jingchang"}, new EthereumWebToken("105d31c6d6b19fdac7e3873572f5e1cd787afe912344a4bf3984d94b0cbb8876"), "ethereum"],
];

const fetch = async (param, header, cookie) => {
  const config = {
    method: "post",
    url: "http://192.168.66.254:50500/",
    headers: {
      cwt: header,
      Cookie: cookie ? `cwt=${cookie}` : ""
    },
    params: {
      cwt: param
    },
    data: {
      method: "server_info",
      params: [{}]
    }
  };
  const res = await axios(config);
  return res;
};
const execute = async(cases, fun) => {
  for (const c of cases) {
    const [payload, webToken, memo] = c;
    const { usr, group } = payload;
    const cwt = webToken.sign(payload);
    try {
      await fun(cwt);
      console.log(chalk.green(` auth success on ${usr || group}, memo is ${memo}`));
    } catch (_) {
      console.error(chalk.red(` auth error on ${usr || group}, memo is ${memo}`));
    }
  }
}
(async () => {
  try {
    await fetch(null, null, null);
    console.log(chalk.red("server doesn't verify auth"));
    return;
  } catch (error) {
    console.log(chalk.green("server verify auth: " + error.message));
  }
  console.log(chalk.green("cwt in headers:"));
  await execute(cases, async (cwt) => await fetch(undefined, cwt, undefined));
  console.log(chalk.green("cwt in query:"));
  await execute(cases, async (cwt) => await fetch(cwt, undefined, undefined));
  console.log(chalk.green("cwt in cookie:"));
  await execute(cases, async (cwt) => await fetch(undefined, undefined, cwt));
})();
