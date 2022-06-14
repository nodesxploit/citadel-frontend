import CryptoCoin from '../CryptoCoin';
export default class CryptoCoinCOSMOS extends CryptoCoin {
  constructor(opts) {
    super(opts);
    this.privateKeyEncoded = opts.privateKeyEncoded || null;
    this.publicKey = opts.publicKey || null;
    this.showFrozenBalance = true;
    this.messages = {
      frozenBalance: 'balanceTooltipInfo.frozenBalanceBalanceInfo1',
    };
    this.unstakeingPerioud = '21';
    this.hasRedelegation = true;
  }

  getPublicKeyDecoded() {
    return typeof this.publicKey === 'string'
      ? this.publicKey
      : Buffer.from(this.publicKey).toString('hex');
  }
}
