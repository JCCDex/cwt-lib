# API of RippleWebToken

## Usage

```javascript
const RippleWebToken = require("@jccdex/cwt-lib").RippleWebToken;
// import { RippleWebToken } from '@jccdex/cwt-lib'
```

### constructor

**syntax:** new RippleWebToken(priv: string, alg?: string)

**priv:** Private key

**alg:** Algorithm _Non-essential_  
If the private key's length is 64 and algorithm is `ed25519`, alg is `ed25519`.  
如果私钥长度为64，算法为ed25519，则alg为ed25519。

### sign

**syntax:** new RippleWebToken(priv: string).sign({ usr: string, time?: string })

**usr:** User name _Non-essential_  
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

### verify

**syntax:** new RippleWebToken(priv: string).verify(token: string)

**token:** chain web token

### Code Examples

```javascript
const webToken = new RippleWebToken("snhfP8ByWeWKWYNWBnr2avbxGCZwt");
const token = webToken.sign({
  usr: "ripple_secp256k1",
  time: 123456
});
const result = webToken.verify(token);
```
