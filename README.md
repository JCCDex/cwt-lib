# cwt-lib (chain-web-token)

![npm](https://img.shields.io/npm/v/@jccdex/cwt-lib.svg)
[![build](https://github.com/JCCDex/cwt-lib/actions/workflows/node.js.yml/badge.svg)](https://github.com/JCCDex/cwt-lib/actions/workflows/node.js.yml)
[![Coverage Status](https://coveralls.io/repos/github/JCCDex/cwt-lib/badge.svg?branch=main)](https://coveralls.io/github/JCCDex/cwt-lib?branch=main)
[![npm downloads](https://img.shields.io/npm/dm/@jccdex/cwt-lib.svg)](http://npm-stat.com/charts.html?package=@jccdex/cwt-lib)

用于区块链身份认证的js库；  
js library for blockchain identity authentication;

使用区块链的私钥对数据结构（{header: ... , payload: ...}）进行签名，生成cwt;  
Using the private key data structure of the blockchain ({header:... , payload: ... }) sign and generate cwt;

使用区块链的公钥对cwt进行验证，证明其身份；  
Verify the cwt using the blockchain's public key to prove its identity;

## Synopsis

`chain web token （缩写cwt)` 是有三部分组成 `header.payload.Signature`,其中的 `Signature` 是对 `header.payload`进行签名。  
`chain web token (abbreviated cwt)` is composed of three parts`header.payload.Signature`, where `Signature` is the signature of `header.payload`.

目前支持**ethereum**、**ripple**、**bitcoin**、**jingtum**。  
Currently support **ethereum**, **ripple**, **bitcoin**, **jingtum**.

## Install

```shell
npm install @jccdex/cwt-lib
```

## CDN

`ChainWebToken` as a global variable. Size is 135k.

```javascript
<script src="https://unpkg.com/@jccdex/cwt-lib/dist/cwt-lib.min.js"></script>
```

## Table of Contents

- [sign](#api)

- [EthereumWebToken](https://github.com/JCCDex/cwt-lib/blob/master/docs/EthereumWebToken.md)

- [BitcoinWebToken](https://github.com/JCCDex/cwt-lib/blob/master/docs/BitcoinWebToken.md)

- [JingtumWebToken](https://github.com/JCCDex/cwt-lib/blob/master/docs/JingtumWebToken.md)

- [RippleWebToken](https://github.com/JCCDex/cwt-lib/blob/master/docs/RippleWebToken.md)

## API

### sign

#### syntax

const sign = ({
chain: string;
privateKey: string;
usr: string;
time?: number;
alg?: string;
})

#### arguments

**chain:** Support chain ('jingtum', 'ripple', 'ethereum', 'bitcoin')

**privateKey:** Private key or secret

**usr:** User name

**time:** Timestamp `unit:s` _Non-essential_

If you want to generate cwt for a specific time, please do not ignore it, otherwise is current time.

**alg:** Algorithm _Non-essential_

If the private key is ripple or jingtum chain, length is 64 and algorithm is `ed25519`, alg is `ed25519`.

#### Code Examples

```javascript
import { sign } from "@jccdex/cwt-lib";
// const sign = require("@jccdex/cwt-lib").sign

const cwt = sign({
  chain: "",
  privateKey: "",
  usr: ""
});

// Result example:
// eyJhbGciOiJzZWNwMjU2azEiLCJ4NWMiOlsiLS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS1cbk1GWXdFQVlIS29aSXpqMENBUVlGSzRFRUFBb0RRZ0FFTVRxOXVhdENOQVhXSFV2U2tPYm0wOTd0cDFJVVAyZVJcbjFyKzU4T3ljNHoyeTNaSFBobFN3K01JUTBHczRkSVZDcHFiMmJjcE9aTkpvUEY5TzYxSEJiQT09XG4tLS0tLUVORCBQVUJMSUMgS0VZLS0tLS0iXSwidHlwZSI6IkNXVCIsImNoYWluIjoiamluZ3R1bSJ9.eyJ1c3IiOiJqaW5ndHVtX3NlY3AyNTZrMSIsInRpbWUiOjEyMzQ1Nn0.MEUCIH546Iz3wqdTgTLHJg3czMbQqLVJHj9iddqXPIr6MnG9AiEAkvKelTLl-ZWvCNJ9O8rWHhksuggz_jgg8wEM44mf9xk

// cwt decode:
//   {
//   header: {
//     alg: 'secp256k1',
//     x5c: [
//       '-----BEGIN PUBLIC KEY-----\n' +
//         'MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAEMTq9uatCNAXWHUvSkObm097tp1IUP2eR\n' +
//         '1r+58Oyc4z2y3ZHPhlSw+MIQ0Gs4dIVCpqb2bcpOZNJoPF9O61HBbA==\n' +
//         '-----END PUBLIC KEY-----'
//     ],// Public key in pem format
//     type: 'CWT',
//     chain: 'jingtum'
//   },
//   payload: { usr: '...usr...', time: Timestamp(unit:s) },
//   signature: 'MEUCIH546Iz3wqdTgTLHJg3czMbQqLVJHj9iddqXPIr6MnG9AiEAkvKelTLl-ZWvCNJ9O8rWHhksuggz_jgg8wEM44mf9xk'
// }
```
