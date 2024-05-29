import { Wallet } from '@ethereumjs/wallet'
import { isValidPrivate, isValidPublic, stripHexPrefix } from '@ethereumjs/util'

export default class EthWallet extends Wallet{
  constructor(key: string) {
    const abjustKey = stripHexPrefix(key);
    super(Buffer.from(abjustKey, 'hex'))
  }
}