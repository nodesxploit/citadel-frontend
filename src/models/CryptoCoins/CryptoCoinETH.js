import CryptoCoin from '../CryptoCoin';
export default class CryptoCoinETH extends CryptoCoin {
  constructor(opts) {
    super(opts);
    this.hideMemo = true;
    this.privateKeyEncoded = opts.privateKeyEncoded || null;
    this.publicKey = opts.publicKey || null;
  }
}
