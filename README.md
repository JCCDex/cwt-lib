# cwt-lib

> A cryptocurrency-compliant js library for generating cwt libraries. chain web token (cwt) is an extension based on jwt (json web token).  
> 一个实现符合加密货币的js库，用于生成cwt库。cwt（chain web token）基于jwt（json web token）进行扩展。
>
> Based on jsontokens library (https://github.com/stacks-network/jsontokens-js).
> 基于jsontokens库进行扩展。

## INSTALL

```shell
npm install @maincc/cwt-lib
```

## Documentation

#### cwt (chain web token)

**`example`** import
```js
import WalletCwt from "@maincc/cwt-lib";
```
- Generate cwt from the private key, user, and chain name.  
  通过私钥、用户和链名生成cwt。

  **`example`** cwtSign(pr, usr, chain) :pr -> 私钥，usr -> 用户名，chain -> 区块链链名
  ```js
  const priv = '105d31c6d6b19fdac7e3873572f5e1cd787afe912344a4bf3984d94b0cbb8876'
  const cwt = WalletCwt.cwtSign(priv, "zhye", "ethereum")
  ```

  **`result`**
  ```js
  eyJ4NWMiOlsiLS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS1cbk1GWXdFQVlIS29aSXpqMENBUVlGSzRFRUFBb0RRZ0FFaWJpcmx6eEtnZ0EzNWp1TUNtSmRhbUNDZ0hhOE9ZSkdcbk9HMFlIRzYxMUk5UDdrTEFBYlNqNGg0SFJHeUNSZnA0Ky9ndkxtcGU1Uis3UFV2bDNHU0NvZz09XG4tLS0tLUVORCBQVUJMSUMgS0VZLS0tLS0iXSwidHlwZSI6IkNXVCIsImNoYWluIjoiZXRoZXJldW0ifQ.eyJ1c3IiOiJ6aHllIiwidGltZSI6MTcxNjM2NTIxOX0.MEUCIGFG7GfUdQl2FeB8FSN_i_aHslbMp8G_XjMUN7HVL-fqAiEArrkKTTJWmWJvFTx4NlPLdSpuMJQNPMfu7pV-fIpEM24
  ```
  <br>
- If you don't have an Ethereum account, you can generate it through generate.  
  如果你并没有以太坊的账户，可以通过generate生成。

  **`example`** generate
  ```js
  const wallet = WalletCwt.generate();
  ```

  **`result`**
  ```js
  {
    privateKey: '0xc5b893aef8c2e847dc14ddadb7dfd3be5781b7a5a46e0cbcc00bfa992c626ddc',
    publicKey: '0x6f592757f8e6506a5f950df6fcbb6b8000b3ef00c24cc69dfdb3155d322b182c4d31216ae1154b63211c8970977ccb2a72272ac0cce8004e0c26c86dfc01046a',
    compressPubKey: '026f592757f8e6506a5f950df6fcbb6b8000b3ef00c24cc69dfdb3155d322b182c',
    address: '0x50692568f1184911ecbfa2de4147fecba5b0b386'
  }
  ```
  <br>
- If you have an Ethereum account and have its public and private keys. Then you can perform cwt related operations.  
  如果你拥有了以太坊的账户，并掌握其公私钥。那么可以进行cwt的相关操作。

  - **`example`** sign
  ```js
  const data = {
    header:{
      type: 'CWT',
      chain: 'ethereum'
    },
    payload:{
      sub: '1234567890',
      name: 'John Doe',
    }
  };
  const cwt = WalletCwt.sign(data, wallet.privateKey);
  ```

    **`result`**
    ```js
    eyJ0eXBlIjoiQ1dUIiwiY2hhaW4iOiJldGhlcmV1bSJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIn0.   j76aew7N2LPJkx1uSpcJ1Wh15EbClTBdIa-ozUuMLtOHQzmWbN8-VWCtYJ_hoj-ZzvJG9tsOOPCWcUX_uRMZPQ
    ```
   The signature must contain payload and header fields.
    
    签名的内容必须带有payload和header字段。
  - **`example`** decode
  ```js
  WalletCwt.decode(cwt)
  ```

    **`result`**
  ```js
    {
      header: { type: 'CWT', chain: 'ethereum' },
      payload: { sub: '1234567890', name: 'John Doe' },
      signature: 'P3AtyDwKLZAGx2JLPnTEln_LGmd7KE48n2XLormwg5e-CyB0k5BNX-y1kg8DA4hMUjtz1cMLtZHHtO8b6fLNAQ'
    }
  ```
  - **`example`** verify  
  ```js
  WalletCwt.verify(cwt, wallet.publicKey) or WalletCwt.verify(cwt, wallet.compressPubKey)
  ```
  **`result`**
  <br>
  ```js
  true
  ```
  <br>
-  If you need public and private keys in pem format, or Signature in cwt is ASN.1 DER format.  
  如果你需要pem格式的公私钥,或者需要cwt里的Signature是ASN.1 DER格式。

  - **`example`** privToPem  
  ```js
  WalletCwt.privToPem(wallet.privateKey)
  ```  
  Convert the private key to pem format. Note: The resulting pem is SEC1 specification.  
  将私钥转换成pem格式，注：生成的是SEC1规范的pem。  
  
    **`result`**  
  ```js
  -----BEGIN EC PRIVATE KEY-----
  MHQCAQEEIMW4k674wuhH3BTdrbff075XgbelpG4MvMAL+pksYm3coAcGBSuBBAAK
  oUQDQgAEb1knV/jmUGpflQ32/LtrgACz7wDCTMad/bMVXTIrGCxNMSFq4RVLYyEc
  iXCXfMsqcicqwMzoAE4MJsht/AEEag==
  -----END EC PRIVATE KEY-----
  ```
  - **`example`** pubToPem  
  ```js
  WalletCwt.pubToPem(wallet.publicKey)
  ```
  Convert the public key to pem format. Note: The parameter must be an uncompressed public key.  
  将公钥转换成pem格式，注：参数必须是未压缩的公钥。  
  
    **`result`**  
  ```js
  -----BEGIN PUBLIC KEY-----
  MFYwEAYHKoZIzj0CAQYFK4EEAAoDQgAEb1knV/jmUGpflQ32/LtrgACz7wDCTMad
  /bMVXTIrGCxNMSFq4RVLYyEciXCXfMsqcicqwMzoAE4MJsht/AEEag==
  -----END PUBLIC KEY-----
  ```
  - **`example`** sign(... , 'der') && verify(... , 'der')  
  ```js
  const cwtDer = WalletCwt.sign(data, wallet.privateKey, 'der');
  WalletCwt.verify(cwtDer, wallet.publicKey, 'der');
  ```
  Generate cwt in ASN.1 DER format (to meet openssl and other cryptographic libraries) and verify.  
  生成符合ASN.1 DER格式的cwt（满足openssl等密码库）并验证。  
  
    **`result`**  
  ```js
  eyJ0eXBlIjoiQ1dUIiwiY2hhaW4iOiJldGhlcmV1bSJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIn0. MEUCIFmR0Jy4-F9oiHjqe01qrNxhtbuBm2T4EKF-ScXu3r4YAiEA-rtEmmLZifsj1isv9wF6-RXDQtxJjkIYTnp4i6GtNmg
  true
  ```

<br>