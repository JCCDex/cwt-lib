# jwt-lib

> A cryptocurrency-compliant js library
> 一个实现符合加密货币的js库
>
> Based on jsontokens library (https://github.com/stacks-network/jsontokens-js).
> 基于jsontokens库进行扩展。

## INSTALL

```shell
npm install jwt-lib-test
```

## Code demonstration

```bash
import walletJwt from "jwt-lib-test"

const wallet = walletJwt.generate();
console.log(wallet);
const data = {
  header:{
    time: new Date().toString(),
  },
  payload:{
    sub: '1234567890',
    name: 'John Doe',
  }
};
const sign = walletJwt.signOfjwt(data, wallet.privateKey);
console.log(sign);
console.log(walletJwt.decodeOfjwt(sign));
console.log(walletJwt.verifyOfjwt(sign, wallet.compressPubKey));
```
