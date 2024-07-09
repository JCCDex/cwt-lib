# API of JingtumWebToken

## Usage

```javascript
const JingtumWebToken = require("@jccdex/cwt-lib").JingtumWebToken;
// import { JingtumWebToken } from '@jccdex/cwt-lib'
```

### constructor

**syntax:** new JingtumWebToken(priv: string, algorithm?: string)

**priv:** Private key

**alg:** Algorithm _Non-essential_

If the private key's length is 64 and algorithm is `ed25519`, alg is `ed25519`.

### generateData

**syntax:** new JingtumWebToken(priv: string).generateData({ usr: string, time?: string })

**usr:** User name

**time:** Timestamp `unit:s` _Non-essential_
If you want to generate cwt for a specific time, please do not ignore it, it will help you generate `data` for a specific time (`data` to be signed by cwt).

### sign

**syntax:** new RippleWebToken(priv: string).sign(data: Record<string, unknown>)

**data:** Data to be signed for cwt generation.The data must contain header and payload fields.

### verify

**syntax:** new JingtumWebToken(priv: string).verify(token: string)

**token:** chain web token

### Code Examples

```javascript
const webToken = new JingtumWebToken("sajoigynKobrB8U59g1puxu8GM7Hg");
const signData = webToken.generateData({
  usr: "jingtum_secp256k1",
  time: 123456
});
const token = webToken.sign(signData);
const result = webToken.verify(token);
```
