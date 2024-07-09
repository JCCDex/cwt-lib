# API of BitcoinWebToken

## Usage

```javascript
const BitcoinWebToken = require("@jccdex/cwt-lib").BitcoinWebToken;
// import { BitcoinWebToken } from '@jccdex/cwt-lib'
```

### constructor

**syntax:** new BitcoinWebToken(priv: string)

**priv:** Private key

### generateData

**syntax:** new BitcoinWebToken(priv: string).generateData({ usr: string, time?: string })

**usr:** User name

**time:** Timestamp `unit:s` _Non-essential_
If you want to generate cwt for a specific time, please do not ignore it, it will help you generate `data` for a specific time (`data` to be signed by cwt).

### sign

**syntax:** new RippleWebToken(priv: string).sign(data: Record<string, unknown>)

**data:** Data to be signed for cwt generation.The data must contain header and payload fields.

### verify

**syntax:** new BitcoinWebToken(priv: string).verify(token: string)

**token:** chain web token

### Code Examples

```javascript
const webToken = new BitcoinWebToken("b9d70b775092fc32eea9868c719eda3dbc8e11fae28be95e0a5bd6bf432d3732");
const signData = webToken.generateData({
  usr: "bitcoin_secp256k1",
  time: 123456
});
const token = webToken.sign(signData);
const result = webToken.verify(token);
```
