# API of BitcoinWebToken

## Usage

```javascript
const BitcoinWebToken = require("@jccdex/cwt-lib").BitcoinWebToken;
// import { BitcoinWebToken } from '@jccdex/cwt-lib'
```

### constructor

**syntax:** new BitcoinWebToken(priv: string)

**priv:** Private key

### sign

**syntax:** new BitcoinWebToken(priv: string).sign({ usr: string, time?: string })

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

**syntax:** new BitcoinWebToken(priv: string).verify(token: string)

**token:** chain web token

### Code Examples

```javascript
const webToken = new BitcoinWebToken("b9d70b775092fc32eea9868c719eda3dbc8e11fae28be95e0a5bd6bf432d3732");
const token = webToken.sign({
  usr: "bitcoin_secp256k1",
  time: 123456
});
const result = webToken.verify(token);
```
