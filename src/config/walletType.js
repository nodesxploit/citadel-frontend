import { i18n } from '@/plugins/i18n';
const { t } = i18n.global;
export const WALLET_TYPES = {
  TREZOR: 'trezor',
  LEDGER: 'ledger',
  ONE_SEED: 'oneSeed',
  PRIVATE_KEY: 'privateKey',
  PUBLIC_KEY: 'publicKey',
  METAMASK: 'metamask',
  KEPLR: 'keplr',
};

export const isHardwareWallet = (type) =>
  [WALLET_TYPES.LEDGER, WALLET_TYPES.TREZOR].includes(type);

export const types = {
  oneSeed: {
    color: '#6A4BFF',
    text: t('oneSeed'),
  },
  privateKey: {
    color: '#00A3FF',
    text: t('privateKey'),
  },
  publicKey: {
    color: '#FF5722',
    text: t('viewOnly'),
  },
  trezor: {
    color: '#0FB774',
    text: 'Trezor',
  },
  ledger: {
    color: '#0FB774',
    text: 'Ledger',
  },
  metamask: {
    color: '#ffb03a',
    text: 'Metamask',
  },
  keplr: {
    color: '#E336E7',
    text: 'Keplr',
  },
};

export const XCT_GOVERNANCE_APP = 'XCT governance';
export const OUR_TOKEN = 'bsc_xct';
export const OUR_NODE = 'Citadel.one';
export const SNIP20_PARENT_NET = 'secret';
export const OSMOSIS_PARENT_NET = 'osmosis';
export const ERC20_PARENT_NET = 'eth';
export const BEP20_PARENT_NET = 'bsc';
export const VIEWING_KEY_TYPES = {
  SVK: 'svk', // simple vk
  RVK: 'rvk', // random vk
  IVK: 'ivk', // imported vk
};

export const TOKEN_STANDARDS = {
  ICS_20: 'ics20',
  SNIP_20: 'snip20',
  ERC_20: 'erc20',
  BEP_20: 'bep20',
  CW_20: 'cw20',
};

export const POLKA_EMPTY = 'empty'; // used for path index
