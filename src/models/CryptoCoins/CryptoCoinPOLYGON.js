import CryptoCoin from '../CryptoCoin';
export default class CryptoCoinPOLYGON extends CryptoCoin {
  constructor(opts) {
    super(opts);
    this.hideMemo = true;
    this.privateKeyEncoded = opts.privateKeyEncoded || null;
    this.publicKey = opts.publicKey || null;
  }
}
