<template>
  <div class="delete">
    <h5 class="delete__title">
      {{ $t('settings.delete.title') }}
    </h5>
    <div class="settings-wrap">
      <span class="delete__description">
        {{ $t('settings.delete.description') }}
      </span>
      <PrimaryButton
        bg-color="#FA3B33"
        hover-bg-color="#fc0800"
        box-shadow="0 0 25px 0 rgba(219, 71, 60, 0.3)"
        class="delete__button"
        data-qa="Delete-account"
        @click="openDeleteAccountModal"
      >
        {{ $t('settings.delete.button') }}
      </PrimaryButton>
    </div>

    <Modal v-if="isDeleteAccountModalOpened">
      <ModalContent
        v-click-away="closeDeleteAccountModal"
        :title="$t('settings.delete.title')"
        icon="warningIcon"
        :desc="$t('settings.delete.modalDescription')"
        type="warning"
        @close="closeDeleteAccountModal"
        @buttonClick="closeDeleteAccountModal"
      >
        <template #default>
          <div class="delete-modal__password">
            <Input
              id="phrase"
              v-model="phrase"
              :label="$t('settings.delete.inputLabel')"
              :placeholder="$t('settings.delete.placeholder')"
              type="text"
              icon="lock"
              data-qa="settings__delete-account__codeword-field"
            />
          </div>

          <div v-if="hasWallets" class="delete-modal__checkbox">
            <Checkbox
              id="backup"
              v-model:value="needSaveBackup"
              :label="$t('logout.modal.downloadBackup')"
              data-qa="settings__delete-account__backup-checkbox"
            />
          </div>
        </template>

        <template #footer>
          <div class="delete-modal__buttons">
            <PrimaryButton
              :disabled="isButtonDisabled"
              bg-color="#FA3B33"
              hover-bg-color="#fc0800"
              class="delete-modal__button"
              data-qa="Delete-account_modal"
              @click="deleteAccount"
            >
              {{ $t('settings.delete.button') }}
            </PrimaryButton>

            <TextButton
              data-qa="settings__delete-account__cancel-button"
              @click="closeDeleteAccountModal"
            >
              {{ $t('cancel') }}
            </TextButton>
          </div>
        </template>
      </ModalContent>
    </Modal>
  </div>
</template>

<script>
import { computed, ref, inject } from 'vue';
import { useStore } from 'vuex';
import PrimaryButton from '@/components/UI/PrimaryButton';
import TextButton from '@/components/UI/TextButton';
import Input from '@/components/UI/Input';
import Checkbox from '@/components/UI/Checkbox';
import Modal from '@/components/Modal';
import ModalContent from '@/components/ModalContent';
import exportPrivateKeys from '@/helpers/exportPrivateKeys';
import { removeStorage } from '@/utils/storage';
import useWallets from '@/compositions/useWallets';

export default {
  name: 'DeleteAccount',
  components: {
    PrimaryButton,
    TextButton,
    Input,
    Checkbox,
    Modal,
    ModalContent,
  },
  props: {},
  setup() {
    const store = useStore();
    const isDeleteAccountModalOpened = ref(false);
    const phrase = ref('');
    const needSaveBackup = ref(true);
    const { wallets } = useWallets();
    const hasWallets = computed(() => !!wallets.value.length);
    const isButtonDisabled = computed(() => phrase.value !== 'delete');
    const userId = computed(() => store.getters['profile/info']?.id);
    const keyStorage = computed(() => `user_${userId.value}`);
    const citadel = inject('citadel');

    const openDeleteAccountModal = () => {
      isDeleteAccountModalOpened.value = true;
      needSaveBackup.value = hasWallets.value;
    };

    const closeDeleteAccountModal = () => {
      isDeleteAccountModalOpened.value = false;
      phrase.value = '';
    };

    const deleteAccount = async () => {
      await store.dispatch('auth/deleteAccount');

      if (needSaveBackup.value && hasWallets.value) {
        exportPrivateKeys(keyStorage.value);
      }

      await store.dispatch('crypto/resetState');
      await citadel.reset(true);
      removeStorage(keyStorage.value);
      window.location.reload(true);
    };

    return {
      phrase,
      isDeleteAccountModalOpened,
      needSaveBackup,
      isButtonDisabled,
      hasWallets,
      deleteAccount,
      closeDeleteAccountModal,
      openDeleteAccountModal,
    };
  },
};
</script>

<style lang="scss" scoped>
.delete {
  @include settings-card-default;
  background: $white url('~@/assets/images/settings/delete-account-bg.png');
  background-repeat: no-repeat;
  background-position: 15%;
  background-size: 25%;

  @include md {
    padding: 22px 29px 22px;
  }

  min-width: 150px;
  height: auto;

  @include laptop {
    align-items: center;
    background: $white;
    .settings-wrap {
      flex-direction: column;
      span {
        width: 100%;
        text-align: center;
        margin: 5px 0 10px;
      }
    }
  }
  &__title {
    color: $red;
  }

  &__button {
    align-self: flex-end;
    margin-top: 15px;
    box-shadow: 0px 0px 25px rgba(219, 71, 60, 0.3);
    @include laptop {
      margin-top: 8px;
      align-self: center;
    }
  }
  @include laptop {
    text-align: center;
  }
}

.delete-modal {
  &__password {
    width: 100%;
    height: 68px;
    margin: 24px 0;
  }

  &__buttons {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 24px;
  }

  &__button,
  &__checkbox {
    margin-bottom: 24px;
  }
}
</style>
