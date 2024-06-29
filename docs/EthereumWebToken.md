# API of EthereumWebToken

## Usage

```javascript
const EthereumWebToken = require('@jccdex/cwt-lib').ethWallet
// import { EthereumWebToken } from '@jccdex/cwt-lib'
```

### constructor

**syntax:** new EthereumWebToken(priv: string)

**priv:** privateKey

### sign

**syntax:** new EthereumWebToken(priv: string).sign({ usr: string, time?: string })

**usr:** userName

**time:** timestamp `unit:s` *Non-essential* If you want to generate cwt for a specific time, please do not ignore it, otherwise cwt for the current time will be generated. 

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

