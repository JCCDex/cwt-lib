# API of JingtumWebToken

## Usage

```javascript
const JingtumWebToken = require('@jccdex/cwt-lib').ethWallet
// import { JingtumWebToken } from '@jccdex/cwt-lib'
```

### constructor

**syntax:** new JingtumWebToken(priv: string, algorithm?: string)

**priv:** privateKey  

**priv:** algorithm *Non-essential* If the private key you entered does not have an identifier, please do not ignore it and enter the corresponding algorithm.  

### sign

**syntax:** new JingtumWebToken(priv: string).sign({ usr: string, time?: string })

**usr:** userName

**time:** timestamp `unit:s` *Non-essential* If you want to generate cwt for a specific time, please do not ignore it, otherwise cwt for the current time will be generated. 

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

