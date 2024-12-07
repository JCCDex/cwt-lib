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

**usr:** User name

**type:** To distinguish between individuals and businesses. _Non-essential_ ('CWT'(default), 'CWT_ENT')  
If you represent your business, please do not ignore it and assign CWT_ENT to it; if you represent yourself, then it is optional for you, but if you decide to use it, please assign CWT to it.

**time:** Timestamp `unit:s` _Non-essential_  
If you want to generate cwt for a specific time, please do not ignore it, otherwise is current time.

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
