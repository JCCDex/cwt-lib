# cwt-lib (chain-web-token) Class

- [Class_ChainToken](#Class_ChainToken)
- [Class_EthWallet](#Class_EthWallet)
- [Class_RippleWallet](#Class_RippleWallet)
- [Class_BitcoinWallet](#Class_BitcoinWallet)
- [Class_JingtumWallet](#Class_JingtumWallet)

Class_ChainToken
=================

- static **quickSign(key: string, usr: string, chain: string)** => *用于快速签名生成cwt。*

`key:` 用于签名的私钥或密钥；`usr:` 用于验证身份的用户名；  

`chain:` 支持的链类型；

```js
const cwt = ChainToken.quickSign('sh3BFjgUiiN3MQvj9toyTZty3RepE', 'jc_ripple', 'ripple');

// eyJhbGciOiJzZWNwMjU2azEiLCJ4NWMiOlsiLS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS1cbk1GWXdFQVlIS29aSXpqMENBUVlGSzRFRUFBb0RRZ0FFWGZCeTNSaHhkNWliUjlXbDhhOVVYUDQ1SDM1M2NONkdcbkpSckt1VTNrbE5rWFNiNFJiNFZUMk0rNU9Za3dMV0tMWXE2MEJyZkFzL3d3YkQzTmlGbFNlZz09XG4tLS0tLUVORCBQVUJMSUMgS0VZLS0tLS0iXSwidHlwZSI6IkNXVCIsImNoYWluIjoicmlwcGxlIn0.eyJ1c3IiOiJqY19yaXBwbGUiLCJ0aW1lIjoxNzE4MjcwMDAwfQ.MEUCIQD1BInytqKAMWACLLZf6hNyLW4GotcJBC18_uW_jPNVawIgDKH1iY-DyVTB845YQAz9X0QgN0cIb84sZnJSugeJM2M
```
- static **decode(token: string)** => *解码生成的cwt。*

`token:` 生成的cwt；

```js
const decoded = ChainToken.decode(cwt);

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

- **constructor (chain: string, key: string, keyType: string)** => *构造函数。*  
 
`chain:` 支持的链类型； `key:` chain所需要的公钥、私钥或者密钥；  

`keyType:` key的类型**（private、public、secret）**；

- **sign(data: {header: any, payload: any}, format: string = "der")** => *进行签名。*  

`data:` 需要签名的数据结构； `format:` 指定cwt里的signature部分的格式；可以是`jose`和`der`,默认是`der`；

- **verify(token: string, format: string = "der")** => *对生成cwt验证。*

`token:` 生成的cwt； `format:` 指定cwt里的signature部分的格式；可以是`jose`和`der`,默认是`der`；

#### CODE:
```js
import { ChainToken } from "@maincc/cwt-lib";

const ripple = {
    secret: 'sh3BFjgUiiN3MQvj9toyTZty3RepE',
    address: 'rhhH4HZc3h5XtK3i1SbDtHzdUr9jseNPgd',
    privateKey: 'c541eaf57d65d5c842ef777cbab1fb8249fce14d5e4ab56e439ec78547a040e7',
    publicKey: '045df072dd187177989b47d5a5f1af545cfe391f7e7770de86251acab94de494d91749be116f8553d8cfb93989302d628b62aeb406b7c0b3fc306c3dcd8859527a'
  };
const data = {
  header: {
    alg: 'secp256k1',
    x5c: [
      '-----BEGIN PUBLIC KEY-----\n' +
        'MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAEXfBy3Rhxd5ibR9Wl8a9UXP45H353cN6G\n' +
        'JRrKuU3klNkXSb4Rb4VT2M+5OYkwLWKLYq60BrfAs/wwbD3NiFlSeg==\n' +
        '-----END PUBLIC KEY-----'
    ],
    type: 'CWT',
    chain: 'ripple'
  },
  payload: { usr: 'jc_ripple', time: 1718270000 },
}
const chainToken = new ChainToken('ripple', ripple.secret, 'secret')
const cwt = chainToken.sign(data);
console.log(cwt);
console.log(ChainToken.decode(cwt));
console.log(chainToken.verify(cwt));

// eyJhbGciOiJzZWNwMjU2azEiLCJ4NWMiOlsiLS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS1cbk1GWXdFQVlIS29aSXpqMENBUVlGSzRFRUFBb0RRZ0FFWGZCeTNSaHhkNWliUjlXbDhhOVVYUDQ1SDM1M2NONkdcbkpSckt1VTNrbE5rWFNiNFJiNFZUMk0rNU9Za3dMV0tMWXE2MEJyZkFzL3d3YkQzTmlGbFNlZz09XG4tLS0tLUVORCBQVUJMSUMgS0VZLS0tLS0iXSwidHlwZSI6IkNXVCIsImNoYWluIjoicmlwcGxlIn0.eyJ1c3IiOiJqY19yaXBwbGUiLCJ0aW1lIjoxNzE4MjcwMDAwfQ.MEUCIQD1BInytqKAMWACLLZf6hNyLW4GotcJBC18_uW_jPNVawIgDKH1iY-DyVTB845YQAz9X0QgN0cIb84sZnJSugeJM2M
// {
//   header: {
//     alg: 'secp256k1',
//     x5c: [
//       '-----BEGIN PUBLIC KEY-----\n' +
//         'MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAEXfBy3Rhxd5ibR9Wl8a9UXP45H353cN6G\n' +
//         'JRrKuU3klNkXSb4Rb4VT2M+5OYkwLWKLYq60BrfAs/wwbD3NiFlSeg==\n' +
//         '-----END PUBLIC KEY-----'
//     ],
//     type: 'CWT',
//     chain: 'ripple'
//   },
//   payload: { usr: 'jc_ripple', time: 1718270000 },
//   signature: 'MEUCIFbRfg9tDyLMXY_qTFgpEvP3U6VZrYdR2p34Y3Hc_3WPAiEAuaPlEHEzBd-37wXFbH7wEyHm1R2tA-u64hRLdYV_UJY'
// }
// true

```

Class_EthWallet
=================
继承@ethereumjs/wallet库，用于生成以太坊相关公私钥对。  
Inherit the @ethereumjs/wallet library for generating Ethereum-related public and private key pairs.

#### CODE
```js
const eth = EthWallet.generate();
console.log('private:', eth.getPrivateKeyString())
console.log('public:', eth.getPublicKeyString())
console.log('address:', eth.getAddressString())

// private: 0xf334a37a55e25ed4d67e781207b4176c0638fa9bd00588ed38518dc63aa6f2c4
// public: 0xaa006f8e98e8cc88c0a8f463d7c672a55bb0228780f02e8f919fab4964afa77661977c9d148986dbf07ebc7ea10472bc9925e323d6e13d4716fa17be7dd5d57e
// address: 0x14a7f4e40822c85d49217f4d2ae9dae20e94bb05
```

Class_RippleWallet
====================
对@swtc/wallet库进行扩展，用于生成ripple相关密钥对。  
Extension of the @swtc/wallet library for generating Ripple-related key pairs.

#### CODE
```js
const ripple_secp256k1 = RippleWallet.generate('secp256k1')
console.log('ripple_secp256k1:', ripple_secp256k1)

const ripple_ed25519 = RippleWallet.generate('ed25519')
console.log('ripple_ed25519:', ripple_ed25519)

// ripple_secp256k1: {
//   secret: 'shvF2asUbn5LRHuLFme2XixvYMitS',
//   address: 'rBRUFuA8MtPtMVzDPDPcXPxztrihM2hBh',
//   privateKey: '0004E32E9E051CD75BE7E638991059B9DE3CB1DEEEC30E1978C5042C5E68EF5CD2',
//   publicKey: '033033C40B8232E71F90C2E335FFD6C99C174BC8BC1C4EAF0DFA00837E1FB65981'
// }
// ripple_ed25519: {
//   secret: 'sEdVTLtNKvsAXTGA4nDLvn9se7vn9vx',
//   address: 'rnJ85aZimPhE3ueE789xv9Y7pjo1KVa43L',
//   privateKey: 'EDF9A992535CB625F2F88F5A6B976FF290BDBE4E0B226B8297F06A521503A665AD',
//   publicKey: 'ED122DFF5DA1856C4DF1ED9ADD91340D4204231613E9E87573C670BCB53EC7AC84'
// }
```

Class_BitcoinWallet
=====================
对bitcoinjs-lib、ecpair、@bitcoinerlab/secp256k1等库进行扩展，用于生成bitcoin相关公私钥对。  
Extended libraries such as bitcoinjs-lib, ecpair, @bitcoinerlab/secp256k1 for generating Bitcoin-related public and private key pairs.

#### CODE
```js
const btc = BitcoinWallet.generate();
console.log(btc);

// {
//   privateKey: '45f940e9c922ce470dfbf45ccca569a020c278c4722082045ccadeb21c942e7f',
//   publicKey: '03e136292afdc6dbea76c2d5258fe6a20caa5c1a967c862ff1014cc64164e6b274',
//   privateKeyWif: 'KyZjKgJFtbbC9Mf6aZP5dBQWMdCtdHC8oDqXG87Af6w2fTvqubck',
//   p2pkhAdress: '12BzepXeicosyinaKUVMFTxp7kUY5FpSD5',
//   p2wpkhAdress: 'bc1qp5xxjv0z03wpg7sdkzxa4w93wn5dr4hh97a3x0'
// }
```

Class_JingtumWallet
=====================
对@swtc/wallet库进行扩展，用于生成jingtum相关密钥对。  
Extend the @swtc/wallet library to generate jingtum-related key pairs.

#### CODE
```js
const jingtum_secp256k1 = JingtumWallet.generate({ algorithm: 'secp256k1' });
console.log("jingtum_secp256k1", jingtum_secp256k1);

const jingtum_ed25519 = JingtumWallet.generate({ algorithm: 'ed25519' });
console.log("jingtum_ed25519", jingtum_ed25519);

// jingtum_secp256k1 {
//     secret: 'sapZNGguL4fmtK3JmV7AxAX3jEkNP',
//     address: 'jEEBEbYZcgPiWYMkrKTGWLVJ8agRUEbUkX',
//     privateKey: '00E971A60AE16338977D64B7E4BE53E9ADBFF41702B8ABF49E3FAEBB32721559DE',
//     publicKey: '03F398E2948B124E80F9EF1E28A2475E02853C727F11F20A1EAE8B8F97A2CF3AFA'
//   }
//   jingtum_ed25519 {
//     secret: 'sEdVeLEPdS5DNQ5ikN8PkKF3FyfTDwz',
//     address: 'jnfBMheaVc8TwoymTk42CdKCrBLBKWmuHf',
//     privateKey: 'ED1E57EC529E3367537F35D6773BB4001DEBFD1E464CD75C581316CD91C32146CB',
//     publicKey: 'EDC960A2850AD948D674F8BB2A1F66419AA401D218AD424E578DA5DB1CD35D559A'
//   }
```


<br>