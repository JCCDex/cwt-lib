# API of EthereumWebToken

## Usage

```javascript
const EthereumWebToken = require("@jccdex/cwt-lib").EthereumWebToken;
// import { EthereumWebToken } from '@jccdex/cwt-lib'
```

### constructor

**syntax:** new EthereumWebToken(priv: string)

**priv:** Private key

### sign

**syntax:** new EthereumWebToken(priv: string).sign({ usr: string, time?: string })

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

**syntax:** new EthereumWebToken(priv: string).verify(token: string)

**token:** chain web token

### Code Examples

```javascript
const webToken = new EthereumWebToken("105d31c6d6b19fdac7e3873572f5e1cd787afe912344a4bf3984d94b0cbb8876");
const token = webToken.sign({
  usr: "zhye",
  time: 123456
});
const result = webToken.verify(token);
```
