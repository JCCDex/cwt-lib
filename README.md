# cwt-lib (chain-web-token)

![npm](https://img.shields.io/npm/v/@jccdex/cwt-lib.svg)
[![build](https://github.com/JCCDex/cwt-lib/actions/workflows/node.js.yml/badge.svg)](https://github.com/JCCDex/cwt-lib/actions/workflows/node.js.yml)
[![Coverage Status](https://coveralls.io/repos/github/JCCDex/cwt-lib/badge.svg?branch=main)](https://coveralls.io/github/JCCDex/cwt-lib?branch=main)
[![npm downloads](https://img.shields.io/npm/dm/@jccdex/cwt-lib.svg)](http://npm-stat.com/charts.html?package=@jccdex/cwt-lib)

基于区块链身份认证的解决方案。
A blockchain-based identity authentication solution.

该方案很好的解决了区块链节点服务和DAPP用户访问的权限控制问题，防止节点被撸毛党滥用的情况，扩展的方案能很好的解决RPC服务方，DAPP应用方和DAPP的用户可信认证问题，从而可以使得RPC服务方可以根据使用量和DAPP应用方结算费用。
This solution effectively addresses the issue of access control for blockchain node services and DApp user access, preventing the misuse of nodes by malicious actors. The extended solution also effectively resolves the trusted authentication of RPC service providers, DApp developers, and DApp users, enabling RPC service providers to settle fees with DApp developers based on usage.

使用区块链的私钥对数据结构（{header: ... , payload: ...}）进行签名，生成cwt;
Using the private key data structure of the blockchain ({header:... , payload: ... }) sign and generate cwt;

使用区块链的公钥对cwt进行验证，证明其身份；
Verify the cwt using the blockchain's public key to prove its identity;

本开源方案包括了前端开发js包，以及APISIX的插件代码，APISIX官方插件下载链接: http://xxxxx.x.xx 
This open-source solution includes a frontend development JavaScript package and APISIX plugin code. The official download link for the APISIX plugin is: http://xxxxx.x.xx

商业场景方案定制，请联系:xxxx 
For customized solutions in commercial scenarios, please contact: xxxx

## Typical Application Scenarios

### Simplified Scenario

![Simplified Scenario](./docs/SolutionA.jpg)

在简易场景中，区块链应用项目方提供了客户端和区块链节点服务，通过客户端和APISIX应用网关持有相同的公钥和私钥对，在应用访问区块链节点时，通过携带访问令牌方式，可以确认访问者是应用的用户，从而放行。
In a simplified scenario, the blockchain application provider offers both a client and blockchain node services. By using the same public and private key pair on the client and APISIX application gateway, when the application accesses the blockchain node, it carries an access token, which verifies that the visitor is a legitimate user of the application, allowing access to proceed.

这个方案是开源而且是免费的，项目方可以通过本项目的安装说明和开发包自行部署集成。
This solution is open-source and free of charge. The blockchain application providers can deploy and integrate it themselves by following the installation instructions and using the development package provided in this project.

该方案的优点是通过网络嗅探和抓包，是没法干扰和欺骗应用网关实现滥用区块链节点的目的；缺点是客户端代码中需要包含约定的公私钥对，需要对代码做混淆来隐藏这个秘密。
The advantage of this solution is that it prevents network sniffing and packet capture from interfering with or deceiving the application gateway, thus avoiding the misuse of blockchain nodes. The drawback is that the client code must include the agreed-upon public and private key pair, which requires code obfuscation to hide this secret.

### User's Private Key Scenario

![User's Private Key Scenario](./docs/SolutionB.png)

在这个场景中，无需使用事先约定隐藏的公私钥对，而是直接用用户操作的区块链账号的私钥来生成访问令牌，区块链应用项目方可以通过自有的用户钱包地址数据库和应用网关一起工作的方式，来确认访问者的身份，从而放行。
In this scenario, there is no need to use pre-agreed hidden public-private key pairs. Instead, the private key of the blockchain account operated by the user is directly used to generate an access token. The blockchain application project team can confirm the identity of the visitor by working with their own user wallet address database and the application gateway, thereby granting access.

和简易方案相比，无需事先约定公私钥对，区块链应用访问节点时需要私钥对访问内容进行签名，同时利用私钥生成访问令牌，这个过程对用户来说基本上是无感的。攻击者无论是通过网络嗅探还是破解客户端都不会造成影响。
Compared to simplified scenario, there is no need to pre-agree on public-private key pairs. When accessing blockchain application nodes, the private key is used to sign the access content and generate an access token. This process is essentially seamless for the user. An attacker would not be able to cause any harm, whether through network sniffing or by hacking the client.

### Enterprise Scenario

![Enterprise Scenario](./docs/SolutionC.png)

现在的区块链节点服务器的搭建运行成本还是比较昂贵的，因此在市场中常见的情况是有专业节点服务厂商利用亚马逊云服务搭建区块链节点为区块链应用项目方提供服务，这种模式的问题在于区块链节点RPC服务入口一旦暴露，被滥用是必然的。
Currently, the cost of setting up and running blockchain node servers is still quite expensive. Therefore, it is common in the market for specialized node service providers to use Amazon cloud services to set up blockchain nodes and offer services to blockchain application project teams. The problem with this model is that once the blockchain node's RPC service entry point is exposed, abuse is inevitable.

在这个场景中，专业节点服务商提供节点服务，应用项目方为节点服务方提供用户认证服务，客户端因此获得对区块链节点的访问权限。
In this scenario, the specialized node service provider offers node services, and the application project team provides user authentication services to the node service provider. As a result, the client gains access to the blockchain node.

这个解决方案可以使得节点服务商不用担心节点资源被滥用，区块链应用项目方无需承担昂贵的节点费用，可以按需付费。
This solution allows node service providers to avoid concerns about the misuse of node resources, and blockchain application project teams do not have to bear the high costs of nodes, enabling them to pay based on actual usage.

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
