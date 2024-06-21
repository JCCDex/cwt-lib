# cwt-lib (chain-web-token)

用于区块链身份认证的js库；  
js library for blockchain identity authentication;  

使用区块链的私钥对数据结构（{header: ... , payload: ...}）进行签名，生成cwt;  
Using the private key data structure of the blockchain ({header:... , payload: ... }) sign and generate cwt;  

使用区块链的公钥对cwt进行验证，证明其身份；  
Verify the cwt using the blockchain's public key to prove its identity;  

Synopsis
=========
`chain web token （缩写cwt)` 是有三部分组成 ` header.payload.Signature `,其中的 `Signature` 是对 ` header.payload `进行签名。  
`chain web token (abbreviated cwt)` is composed of three parts` header.payload.Signature `, where ` Signature ` is the signature of `header.payload`.

` cwt-lib ` 是基于 `jsontokens、crypto` 库进行扩展。  
` cwt-lib ` is based on the ` jsontokens, crypto ` library extension.

目前支持`ethereum`、`ripple`、`bitcoin`、`jingtum`。  
Currently support `ethereum`, `ripple`, `bitcoin`, `jingtum`.

Installation_&&_Import
======================
**Installation**

```shell
npm install @maincc/cwt-lib
```

**Import**

```js
import { ChainToken } from "@maincc/cwt-lib"
```

Quick_Sign（cwt生成）
==========
` quickSign(key: string, usr: string, chain: string) `  

**syntax:** *const cwt = ChainToken.quickSign(key, usr, chain)*  

`key:` 用于签名的私钥或密钥；`usr:` 用于验证身份的用户名；  

`chain:` 支持的链类型；

#### CODE
```js
const cwt = ChainToken.quickSign('sh3BFjgUiiN3MQvj9toyTZty3RepE', 'jc_ripple', 'ripple');
```

生成的cwt可用于身份认证。  
**注意**： header和payload在代码中已经自动生成，认证程序须根据生成的header和payload进行操作。

decode (解码cwt)
======
` decode(token: string) `

**syntax:** *const decode = ChainToken.decode(cwt)*  

`token:` 生成的cwt；

#### CODE
```js
const decode = ChainToken.decode(cwt)

// {
//     header: {
//       alg: 'secp256k1',  // 生成公私钥所使用的算法，根据chain和key自动生成。
//       x5c: [
//         '-----BEGIN PUBLIC KEY-----\n' +
//           'MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAEXfBy3Rhxd5ibR9Wl8a9UXP45H353cN6G\n' +
//           'JRrKuU3klNkXSb4Rb4VT2M+5OYkwLWKLYq60BrfAs/wwbD3NiFlSeg==\n' +
//           '-----END PUBLIC KEY-----'
//       ],  // PEM格式的公钥，根据key（私钥或密钥）自动生成。
//       type: 'CWT',  // cwt
//       chain: 'ripple'  // 区块链类型
//     },
//     payload: {
//       usr: 'jc_ripple', // usr=>在后端注册的用户名
//       time: 1718270000  // time=>生成cwt的时间戳（单位：秒）
//     }, 
//     signature: 'MEUCIQD1BInytqKAMWACLLZf6hNyLW4GotcJBC18_uW_jPNVawIgDKH1iY-DyVTB845YQAz9X0QgN0cIb84sZnJSugeJM2M'
//   }
```

verify (认证cwt)
=================
如果想使用这个库进行认证，请查看 [CLASS_README](/CLASS_README)


<br>