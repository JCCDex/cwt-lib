# API of RippleWebToken

## Usage

```javascript
const RippleWebToken = require('@jccdex/cwt-lib').ethWallet
// import { RippleWebToken } from '@jccdex/cwt-lib'
```

### constructor

**syntax:** new RippleWebToken(priv: string, algorithm?: string)

**priv:** privateKey  

**priv:** algorithm *Non-essential* If the private key you entered does not have an identifier, please do not ignore it and enter the corresponding algorithm.  

### sign

**syntax:** new RippleWebToken(priv: string).sign({ usr: string, time?: string })

**usr:** userName

**time:** timestamp `unit:s` *Non-essential* If you want to generate cwt for a specific time, please do not ignore it, otherwise cwt for the current time will be generated. 

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

