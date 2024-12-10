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
usr?: string;
group?: string;
time?: number;
alg?: string;
})

#### arguments

**chain:** Support chain ('jingtum', 'ripple', 'ethereum', 'bitcoin')

**privateKey:** Private key or secret

**usr:** User name  _Non-essential_

If you represent an **individual**, please use this parameter. Because it is **required**.  
如果您代表**个人**，请使用此参数。因为它是**必需的**。

**group:** group name (enterprise name) _Non-essential_

If you represent a **business (organization)**, please use this parameter. Because it is **required**.  
如果您代表一家**企业（组织）**，请使用此参数。因为它是**必需的**。

**Note: One of the two parameters, usr and group, must exist, but not both.**  
**注意：usr 和 group 两个参数中必须有一个存在，但不能同时存在。**

**time:** Timestamp `unit:s` _Non-essential_

If you want to generate cwt for a specific time, please do not ignore it, otherwise is current time.  
如果要为特定时间生成cwt，请不要忽略它，否则就是当前时间。

**alg:** Algorithm _Non-essential_

If the private key is ripple or jingtum chain, length is 64 and algorithm is `ed25519`, alg is `ed25519`.  
如果私钥是ripple或者jingtum chain，长度为64，算法为`ed25519`，alg为`ed25519`。

#### Code Examples

```javascript
import { sign } from "@jccdex/cwt-lib";
// const sign = require("@jccdex/cwt-lib").sign

// Representing an individual
const cwt = sign({
  chain: "",
  privateKey: "",
  usr: ""
});

// Result example:
// eyJ4NWMiOlsiLS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS1cbk1EWXdFQVlIS29aSXpqMENBUVlGSzRFRUFBb0RJZ0FDTVRxOXVhdENOQVhXSFV2U2tPYm0wOTd0cDFJVVAyZVJcbjFyKzU4T3ljNHowPVxuLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tIl0sInR5cGUiOiJDV1QiLCJjaGFpbiI6Imppbmd0dW0iLCJhbGciOiJzZWNwMjU2azEifQ.eyJ1c3IiOiJqaW5ndHVtX3NlY3AyNTZrMSIsInRpbWUiOjE3MzM3MjUyMTR9.MEQCID4QhpIVqP_S-4Ev_lmsmc00ESajWe3AzEm0acN2rr09AiBbZXhJEB7sCby8r-j3rvPa5L0rY4k92OuN9BT8MRgX8w

// cwt decode:
{
  header: {
    x5c: [
      '-----BEGIN PUBLIC KEY-----\n' +
        'MDYwEAYHKoZIzj0CAQYFK4EEAAoDIgACMTq9uatCNAXWHUvSkObm097tp1IUP2eR\n' +
        '1r+58Oyc4z0=\n' +
        '-----END PUBLIC KEY-----'
    ],
    type: 'CWT',
    chain: 'jingtum',
    alg: 'secp256k1'
  },
  payload: { usr: 'jingtum_secp256k1', time: 1733725214 },
  signature: 'MEQCID4QhpIVqP_S-4Ev_lmsmc00ESajWe3AzEm0acN2rr09AiBbZXhJEB7sCby8r-j3rvPa5L0rY4k92OuN9BT8MRgX8w'
}

// Representative companies
const cwt = sign({
  chain: "",
  privateKey: "",
  group: ""
});

// Result example:
// eyJ4NWMiOlsiLS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS1cbk1EWXdFQVlIS29aSXpqMENBUVlGSzRFRUFBb0RJZ0FDTVRxOXVhdENOQVhXSFV2U2tPYm0wOTd0cDFJVVAyZVJcbjFyKzU4T3ljNHowPVxuLS0tLS1FTkQgUFVCTElDIEtFWS0tLS0tIl0sInR5cGUiOiJDV1RfRU5UIiwiY2hhaW4iOiJqaW5ndHVtIiwiYWxnIjoic2VjcDI1NmsxIn0.eyJncm91cCI6Imppbmd0dW1fc2VjcDI1NmsxIiwidGltZSI6MTczMzcyNDk3N30.MEUCID1AnOy-XHgteraJI8vN8FmbyoBa59bidmlWIukmGeL1AiEA-btR9DQ_JDRKDNppQqxo0HmuFupFZT7CD_lA1JR59Zk

// cwt decode:
{
  header: {
    x5c: [
      '-----BEGIN PUBLIC KEY-----\n' +
        'MDYwEAYHKoZIzj0CAQYFK4EEAAoDIgACMTq9uatCNAXWHUvSkObm097tp1IUP2eR\n' +
        '1r+58Oyc4z0=\n' +
        '-----END PUBLIC KEY-----'
    ],
    type: 'CWT_ENT',
    chain: 'jingtum',
    alg: 'secp256k1'
  },
  payload: { group: 'jingtum_secp256k1', time: 1733724977 },
  signature: 'MEUCID1AnOy-XHgteraJI8vN8FmbyoBa59bidmlWIukmGeL1AiEA-btR9DQ_JDRKDNppQqxo0HmuFupFZT7CD_lA1JR59Zk'
}

```
