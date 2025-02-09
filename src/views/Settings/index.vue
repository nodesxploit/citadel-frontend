<template>
  <div class="settings">
    <div class="settings__left-side">
      <CrossChain :visibleClass="'comingSoon'" />
      <Addresses @exportWallet="exportWallet" />
    </div>

    <div class="settings__right-side">
      <div class="settings__cross-chain">
        <CrossChain :visibleClass="'comingSoon'" />
      </div>
      <div class="settings__transfer-data">
        <TransferData />
      </div>

      <div class="settings__right-wrap">
        <div class="two_in_one">
          <Language />
          <Subscriptions />
        </div>

        <div class="column">
          <ChangeEmail :visibleClass="'comingSoon'" />
          <ChangePassword />
        </div>

        <ExtensionSettings :visibleClass="'comingSoon'" />

        <DeleteAccount />
      </div>
    </div>

    <teleport to="body">
      <Modal v-if="showModal">
        <ModalContent
          v-if="showChooseMethodModal"
          v-click-away="modalCloseHandler"
          :title="$t('exportWallet.chooseExportTypeModalTitle')"
          :desc="$t('exportWallet.chooseExportTypeModalDesc')"
          :submit-button="false"
          type="action"
          @close="modalCloseHandler"
        >
          <ChooseExportType
            :current-export-wallet="currentExportWallet"
            @chooseMethod="chooseMethod"
          />
        </ModalContent>
        <ModalContent
          v-if="showApproveExportModal"
          v-click-away="modalCloseHandler"
          :title="approveExportModalData.title"
          :desc="approveExportModalData.desc"
          type="action"
          button-text="show"
          :disabled="!!inputError"
          data-qa="settings__export"
          @close="modalCloseHandler"
          @buttonClick="approveExport"
        >
          <ApproveExport
            :current-export-wallet="currentExportWallet"
            @approveExport="approveExport"
          />
        </ModalContent>
        <ModalContent
          v-if="showExportModal"
          v-click-away="modalCloseHandler"
          :title="exportModalData.title"
          :desc="exportModalData.desc"
          type="action"
          :submit-button="false"
          @close="modalCloseHandler"
        >
          <ExportModal
            :current-export-method="currentExportMethod"
            :private-key="decodedPrivateKey"
            :mnemonic-phrase="decodedMnemonick"
          />
        </ModalContent>
        <ModalContent
          v-if="manageVkWallets && !changeVk"
          v-click-away="modalCloseHandler"
          class="manage-vk-modal"
          :title="$t('viewingKey.viewingKeys')"
          :desc="$t('viewingKey.vkListedBelow')"
          :submit-button="false"
          type="action"
          @close="modalCloseHandler"
        >
          <ManageViewingKeysModal :wallet="manageVkWallets" />
        </ModalContent>
        <ModalContent
          v-if="changeVk"
          v-click-away="handleChangeVkClose"
          :title="$t('viewingKey.manageVks')"
          :desc="$t('viewingKey.vkDesc')"
          :submit-button="false"
          type="action"
          @close="handleChangeVkClose"
        >
          <ChangeVkModal :vk="changeVk" :wallet="manageVkWallets" />
        </ModalContent>
      </Modal>
      <div v-if="showCreateVkModal">
        <CreateVkModal
          :address="createVkWallet.address"
          :token="createVkViewingKey"
          :token-fee="snip20TokenFee"
          :current-wallet="createVkWallet"
          :redirect="false"
          :vk-type="'random'"
          @close="closeCreateVkModal"
        />
      </div>
    </teleport>
  </div>
</template>

<script>
import ExportModal from './components/ExportModal.vue';
import ApproveExport from './components/ApproveExport.vue';
import ChooseExportType from './components/ChooseExportType.vue';
import ModalContent from '@/components/ModalContent';
import Addresses from './components/Addresses';
import Subscriptions from './components/Subscriptions';
import TransferData from './components/TransferData';
import ChangeEmail from './components/Account/Email';
import ChangePassword from './components/Account/Password';
import DeleteAccount from './components/Account/Delete';
import Language from './components/Language';
import CreateVkModal from '@/views/Wallet/components/CreateVkModal.vue';
import ManageViewingKeysModal from './components/ManageViewingKeysModal';
import ChangeVkModal from './components/ChangeVkModal.vue';
import Modal from '@/components/Modal';
import CrossChain from './components/CrossChain';
import ExtensionSettings from './components/ExtensionSettings';
import { computed, provide, ref, onMounted, watch } from 'vue';
import { WALLET_TYPES, VIEWING_KEY_TYPES } from '@/config/walletType';
import { i18n } from '@/plugins/i18n';
import useCheckPassword from '@/compositions/useCheckPassword';
import { useStore } from 'vuex';

export default {
  name: 'Settings',
  components: {
    Modal,
    Addresses,
    Subscriptions,
    TransferData,
    ChangeEmail,
    Language,
    DeleteAccount,
    ModalContent,
    ChooseExportType,
    ApproveExport,
    ExportModal,
    ManageViewingKeysModal,
    ChangeVkModal,
    CreateVkModal,
    CrossChain,
    ChangePassword,
    ExtensionSettings,
  },
  setup() {
    const store = useStore();
    const { t } = i18n.global;
    const showModal = ref(false);
    const { password, passwordError, inputError } = useCheckPassword();
    const updatePassword = (value) => {
      password.value = value;
    };
    provide('password', password);
    provide('updatePassword', updatePassword);
    provide('inputError', inputError);

    const manageVkWallets = ref(null);
    provide('manageVkWallets', manageVkWallets);
    const changeVk = ref(null);
    provide('changeVk', changeVk);
    const handleChangeVkClose = () => {
      changeVk.value = null;
    };

    const showCreateVkModal = ref(false);
    const createVkWallet = ref(null);
    const createVkViewingKey = ref(null);
    const snip20TokenFee = ref(null);
    // both parameters must be instances
    const openCreateVkModal = async ({ wallet, vk }) => {
      showModal.value = false;
      showCreateVkModal.value = true;
      createVkWallet.value = wallet;
      createVkViewingKey.value = vk;
      snip20TokenFee.value =
        (await vk.getFees(vk.id, vk.net))?.data?.high?.fee || 0.2;
    };
    provide('openCreateVkModal', openCreateVkModal);
    const closeCreateVkModal = () => {
      showCreateVkModal.value = false;
      createVkWallet.value = null;
      createVkViewingKey.value = null;
      snip20TokenFee.value = null;
      manageVkWallets.value = null;
      changeVk.value = null;
    };

    onMounted(() => {
      store.dispatch('wallets/initHiddenWallets');
    });

    watch(
      () => manageVkWallets.value,
      (val) => {
        showModal.value = !!val;
      }
    );

    const modalCloseHandler = () => {
      showModal.value = false;
      showChooseMethodModal.value = false;
      showApproveExportModal.value = false;
      currentExportMethod.value = null;
      currentExportWallet.value = null;
      showExportModal.value = false;
      decodedMnemonick.value = '';
      inputError.value = false;
      manageVkWallets.value = null;
      changeVk.value = null;
      updatePassword('');
    };

    const currentExportMethod = ref(null);
    const currentExportWallet = ref(null);
    const showApproveExportModal = ref(false);
    const showChooseMethodModal = ref(false);
    const showExportModal = ref(false);
    const exportWallet = (wallet) => {
      showModal.value = true;
      showChooseMethodModal.value = true;
      currentExportWallet.value = wallet;
    };

    const chooseMethod = (val) => {
      currentExportMethod.value = val;
      showChooseMethodModal.value = false;
      showApproveExportModal.value = true;
    };

    const approveExportModalData = computed(() => {
      if (currentExportMethod.value === WALLET_TYPES.PRIVATE_KEY) {
        return {
          title: t('exportWallet.approveExportModalTitle1'),
          desc: t('exportWallet.approveExportModalDesc1'),
        };
      } else if (currentExportMethod.value === WALLET_TYPES.ONE_SEED) {
        return {
          title: t('exportWallet.approveExportModalTitle2'),
          desc: t('exportWallet.approveExportModalDesc2'),
        };
      }

      return {};
    });
    const exportModalData = computed(() => {
      if (currentExportMethod.value === WALLET_TYPES.PRIVATE_KEY) {
        return {
          title: t('exportWallet.exportModalTitle1'),
          desc: t('exportWallet.exportModalDesc'),
        };
      } else if (currentExportMethod.value === WALLET_TYPES.ONE_SEED) {
        return {
          title: t('exportWallet.exportModalTitle2'),
          desc: t('exportWallet.exportModalDesc'),
        };
      }

      return {};
    });
    const decodedMnemonick = ref('');
    const decodedPrivateKey = ref('');
    const approveExport = () => {
      if (passwordError.value) {
        inputError.value = passwordError.value;

        return;
      } else if (currentExportMethod.value === WALLET_TYPES.ONE_SEED) {
        if (!currentExportWallet.value.importedFromSeed) {
          // export main account oneSeed
          decodedMnemonick.value = store.getters['crypto/decodeUserMnemonic'](
            password.value
          );
        }

        // type wallet - private key (oneSeed), and export its oneSeed
        decodedMnemonick.value = store.getters['crypto/decodeUserMnemonic'](
          password.value,
          currentExportWallet.value.importedFromSeed
        );
      } else if (currentExportMethod.value === WALLET_TYPES.PRIVATE_KEY) {
        decodedPrivateKey.value =
          currentExportWallet.value.getPrivateKeyDecoded(password.value);
      }

      showApproveExportModal.value = false;
      showExportModal.value = true;
    };

    return {
      modalCloseHandler,
      showModal,
      exportWallet,
      chooseMethod,
      showChooseMethodModal,
      showApproveExportModal,
      WALLET_TYPES,
      approveExportModalData,
      currentExportWallet,
      approveExport,
      showExportModal,
      currentExportMethod,
      decodedMnemonick,
      exportModalData,
      decodedPrivateKey,
      inputError,
      manageVkWallets,
      changeVk,
      handleChangeVkClose,
      showCreateVkModal,
      createVkViewingKey,
      createVkWallet,
      snip20TokenFee,
      closeCreateVkModal,
      VIEWING_KEY_TYPES,
    };
  },
};
</script>

<style lang="scss" scoped>
.settings {
  line-height: 1.5 !important;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;

  & > div {
    &:first-child {
      flex: 0 0 63%;
    }
    &:nth-child(2) {
      flex: 0 0 35%;
    }

    @include laptop-xl {
      &:first-child,
      &:nth-child(2) {
        flex: 0 0 49%;
      }
    }
  }
  &__left-side {
    & .cross-chain-card {
      display: none;
    }
    @include laptop-l {
      & .cross-chain-card {
        display: flex;
        margin-bottom: $card-margin;
      }
    }
    @include laptop {
      & .cross-chain-card {
        display: flex;
        margin-bottom: $card-margin;
      }
    }
  }

  &__right-side {
    & > div {
      margin-bottom: $card-margin;
    }

    @include laptop-l {
      & .settings__cross-chain {
        display: none;
      }
    }

    @include laptop {
      & .settings__cross-chain {
        display: none;
      }
    }

    .two_in_one {
      @include card-default;

      & > div {
        border-radius: 0;
        padding: 0;
        box-shadow: none;
        filter: none;
      }
      & > div:not(:last-child) {
        margin-bottom: $card-margin;
      }
    }

    .column {
      display: flex;
      flex-direction: column;
      div:first-child {
        margin-bottom: $card-margin;
      }
    }
    @include laptop-l {
      & .cross-chain-card {
        display: none;
      }
    }
  }

  &__right-wrap {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: stretch;

    & > div {
      flex: 0 0 49%;
      margin-bottom: $card-margin;
      @include laptop-l {
        flex: 0 0 100%;
      }
      @include laptop {
        flex: 0 0 100%;
      }
    }
  }
}
.manage-vk-modal {
  max-width: 850px;
  width: 100% !important;
}
</style>
