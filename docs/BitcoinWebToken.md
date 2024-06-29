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
