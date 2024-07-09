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

### generateData

**syntax:** new RippleWebToken(priv: string).generateData({ usr: string, time?: string })

**usr:** User name

**time:** Timestamp `unit:s` _Non-essential_
If you want to generate cwt for a specific time, please do not ignore it, it will help you generate `data` for a specific time (`data` to be signed by cwt).

### sign

**syntax:** new RippleWebToken(priv: string).sign(data: Record<string, unknown>)

**data:** Data to be signed for cwt generation.The data must contain header and payload fields.

### verify

**syntax:** new RippleWebToken(priv: string).verify(token: string)

**token:** chain web token

### Code Examples

```javascript
const webToken = new RippleWebToken("snhfP8ByWeWKWYNWBnr2avbxGCZwt");
const signData = webToken.generateData({
  usr: "ripple_secp256k1",
  time: 123456
});
const token = webToken.sign(signData);
const result = webToken.verify(token);
```
