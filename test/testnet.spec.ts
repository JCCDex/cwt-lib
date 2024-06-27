import axios from "axios";
import * as colors from "colors";
import { EthereumWebToken, BitcoinWebToken, JingtumWebToken, RippleWebToken } from "../src";

const fetch = async (cwt) => {
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

const testEthereum = async () => {
  const webToken = new EthereumWebToken("105d31c6d6b19fdac7e3873572f5e1cd787afe912344a4bf3984d94b0cbb8876");

  const payload = {
    usr: "zhye",
    time: Math.floor(new Date().getTime() / 1000)
  };
  const cwt = webToken.sign(payload);
  try {
    await fetch(cwt);
    console.log(colors.green("auth success on ethereum secp256k1"));
  } catch (_) {
    console.error(colors.red("auth error on ethereum secp256k1"));
  }
};

const testBitcoin = async () => {
  const webToken = new BitcoinWebToken("b9d70b775092fc32eea9868c719eda3dbc8e11fae28be95e0a5bd6bf432d3732");

  const payload = {
    usr: "bitcoin_secp256k1",
    time: Math.floor(new Date().getTime() / 1000)
  };
  const cwt = webToken.sign(payload);
  try {
    await fetch(cwt);
    console.log(colors.green("auth success on bitcoin secp256k1"));
  } catch (error) {
    console.error(colors.red("auth error on bitcoin secp256k1"));
  }
};

const testRipple25519 = async () => {
  const webToken = new RippleWebToken("sEdTSMh6UwzwexTFEkyvXc5bxWzTs2n");

  const payload = {
    usr: "ripple_ed25519",
    time: Math.floor(new Date().getTime() / 1000)
  };
  const cwt = webToken.sign(payload);
  try {
    await fetch(cwt);
    console.log(colors.green("auth success on ripple ed25519"));
  } catch (_) {
    console.error(colors.red("auth error on ripple ed25519"));
  }
};

const testRippleEcp256k1 = async () => {
  const webToken = new RippleWebToken("snhfP8ByWeWKWYNWBnr2avbxGCZwt");

  const payload = {
    usr: "ripple_secp256k1",
    time: Math.floor(new Date().getTime() / 1000)
  };
  const cwt = webToken.sign(payload);
  try {
    await fetch(cwt);
    console.log(colors.green("auth success on ripple secp256k1"));
  } catch (_) {
    console.error(colors.red("auth error on ripple secp256k1"));
  }
};

const testJingtumSecp256k1 = async () => {
  const webToken = new JingtumWebToken("sajoigynKobrB8U59g1puxu8GM7Hg");
  const payload = {
    usr: "jingtum_secp256k1"
  };
  const cwt = webToken.sign(payload);
  try {
    await fetch(cwt);
    console.log(colors.green("auth success on jingtum secp256k1"));
  } catch (_) {
    console.error(colors.red("auth error on jingtum secp256k1"));
  }
};

const testJingtumEd25519 = async () => {
  const webToken = new JingtumWebToken("sEdVrj9hBjNTPGnm4qN4iVXSQv7KMzB");
  const payload = {
    usr: "jingtum_ed25519",
    time: Math.floor(new Date().getTime() / 1000)
  };
  const cwt = webToken.sign(payload);
  try {
    await fetch(cwt);
    console.log(colors.green("auth success on ripple ed25519"));
  } catch (_) {
    console.error(colors.red("auth error on jingtum ed25519"));
  }
};

testEthereum();
testBitcoin();
testRipple25519();
testRippleEcp256k1();
testJingtumSecp256k1();
testJingtumEd25519();
