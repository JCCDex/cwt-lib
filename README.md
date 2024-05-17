# jwt-lib

> A cryptocurrency-compliant js library
> 一个实现符合加密货币的js库
>
> Based on jsontokens library (https://github.com/stacks-network/jsontokens-js).
> 基于jsontokens库进行扩展。

## INSTALL

```shell
npm install @maincc/jwt-lib
```

## Documentation

**`example`** import
```js
import WalletJwt from "@maincc/jwt-lib";
```

- If you don't have an Ethereum account, you can generate it through generate.  
  如果你并没有以太坊的账户，可以通过generate生成。

  **`example`** generate
  ```js
  const wallet = WalletJwt.generate();
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
- If you have an Ethereum account and have its public and private keys. Then you can perform jwt related operations.  
  如果你拥有了以太坊的账户，并掌握其公私钥。那么可以进行jwt的相关操作。

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
  const jwt = WalletJwt.sign(data, wallet.privateKey);
  ```

    **`result`**
    ```js
    eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksiLCJ0eXBlIjoiQ1dUIiwiY2hhaW4iOiJldGhlcmV1bSJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIn0.5ZICOX22jNPVeewb3o0fsMSJM04CQnO5aIbZaW_vfakwYUReR2-mZEiDkz-ezdmkOH6xKObnZDpMcNCnv9n-Rw
    ```
    <font color=red size=2> The signature must carry the payload field. During the signature, typ: 'JWT', alg: 'ES256K' is automatically added to the header.</font>
    
    <font color=red size=2>签名的内容必须带有payload字段，签名过程中会在header里自动添加 typ: 'JWT', alg: 'ES256K'</font>
  <br><br>  
  - **`example`** decode
  ```js
  WalletJwt.decode(jwt)
  ```

    **`result`**
  ```js
  {
    header: { typ: 'JWT', alg: 'ES256K', type: 'CWT', chain: 'ethereum' },
    payload: { sub: '1234567890', name: 'John Doe' },
    signature: '5ZICOX22jNPVeewb3o0fsMSJM04CQnO5aIbZaW_vfakwYUReR2-mZEiDkz-ezdmkOH6xKObnZDpMcNCnv9n-Rw'
  }
  ```
  <br>
  - **`example`** verify
  ```js
  WalletJwt.verify(jwt, wallet.publicKey) or WalletJwt.verify(jwt, wallet.compressPubKey)
  ```

    **`result`**
  ```js
  true
  ```
  <br>
-  If you need pem format public and private keys, or if you need jwt Signature in ASN.1 DER format, the length is 70 bytes.  
  如果你需要pem格式的公私钥,或者需要jwt里的Signature是是ASN.1 DER格式，长度为70字节。

  - **`example`** privToPem  
  <br>
  ```js
  WalletJwt.privToPem(wallet.privateKey)
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
  <br>
  - **`example`** pubToPem  
  <br>
  ```js
  WalletJwt.pubToPem(wallet.publicKey)
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
  <br>
  - **`example`** sign(... , 70) && verify(... , 70)  
  <br>
  ```js
  const jwt70 = WalletJwt.sign(data, wallet.privateKey, 70);
  WalletJwt.verify(jwt70, wallet.publicKey, 70);
  ```
  Generate jwt in ASN.1 DER format (to meet openssl and other cryptographic libraries) and verify.  
  生成符合ASN.1 DER格式的jwt（满足openssl等密码库）并验证。  

    **`result`**  
  ```js
  eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksiLCJ0eXBlIjoiQ1dUIiwiY2hhaW4iOiJldGhlcmV1bSJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIn0.MEUCIQDlkgI5fbaM09V57BvejR-wxIkzTgJCc7lohtlpb-99qQIgMGFEXkdvpmRIg5M_ns3ZpDh-sSjm52Q6THDQp7_Z_kc
  true
  ```

<br>