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

**usr:** User name

**type:** To distinguish between individuals and businesses. _Non-essential_ ('CWT'(default), 'CWT_ENT')  
If you represent your business, please do not ignore it and assign CWT_ENT to it; if you represent yourself, then it is optional for you, but if you decide to use it, please assign CWT to it.

**time:** Timestamp `unit:s` _Non-essential_  
If you want to generate cwt for a specific time, please do not ignore it, otherwise is current time.

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
