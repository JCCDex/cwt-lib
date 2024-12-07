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

### sign

**syntax:** new JingtumWebToken(priv: string).sign({ usr: string, time?: string })

**usr:** User name

**type:** To distinguish between individuals and businesses. _Non-essential_ ('CWT'(default), 'CWT_ENT')  
If you represent your business, please do not ignore it and assign CWT_ENT to it; if you represent yourself, then it is optional for you, but if you decide to use it, please assign CWT to it.

**time:** Timestamp `unit:s` _Non-essential_  
If you want to generate cwt for a specific time, please do not ignore it, otherwise is current time.

### verify

**syntax:** new JingtumWebToken(priv: string).verify(token: string)

**token:** chain web token

### Code Examples

```javascript
const webToken = new JingtumWebToken("sajoigynKobrB8U59g1puxu8GM7Hg");
const token = webToken.sign({
  usr: "jingtum_secp256k1",
  time: 123456
});
const result = webToken.verify(token);
```
