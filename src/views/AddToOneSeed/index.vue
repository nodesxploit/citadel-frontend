<template>
  <div class="add-to-one-seed">
    <Header :current-step="currentStep" :steps="steps" />
    <div v-if="isUserMnemonic" class="add-to-one-seed__section">
      <!-- <Stepper :steps="steps" /> -->
      <EnterPassword
        v-if="currentStep === 1"
        @passwordConfirmed="setPassword"
      />
      <SelectNetworks v-if="currentStep === 2" @selectNets="finalStep" />
    </div>
    <div v-else class="add-to-one-seed__section">
      <!-- <Stepper :steps="steps" /> -->
      <EnterPassword
        v-if="currentStep === 1 && isPasswordHash"
        @passwordConfirmed="setPassword"
      />
      <keep-alive v-else-if="currentStep === 1">
        <CreatePassword @createPassword="setPassword" />
      </keep-alive>
      <CreateOneSeed v-if="currentStep === 2" @createMnemonic="setMnemonic" />
      <ConfirmOneSeed
        v-if="currentStep === 3"
        :mnemonic="walletOpts.mnemonic"
      />
      <SelectNetworks v-if="currentStep === 4" @selectNets="finalStep" />
    </div>
  </div>
</template>

<script>
import { onMounted } from 'vue';
import ConfirmOneSeed from './components/ConfirmOneSeed';
import CreateOneSeed from './components/CreateOneSeed';
import SelectNetworks from './components/SelectNetworks';
import Header from '../AddAddress/components/Header';
import EnterPassword from './components/EnterPassword';
import CreatePassword from './components/CreatePassword';
import useCurrentStep from '@/compositions/useCurrentStep';
import {
  steps as stepsOneSeed,
  steps1 as stepsOneSeed1,
} from '@/static/addToOneSeed';
import useCreateWallets from '@/compositions/useCreateWallets';
import { WALLET_TYPES } from '../../config/walletType';
import { useStore } from 'vuex';

export default {
  name: 'AddToOneSeed',
  components: {
    Header,
    EnterPassword,
    CreatePassword,
    SelectNetworks,
    CreateOneSeed,
    ConfirmOneSeed,
  },
  setup() {
    const {
      setPassword,
      setMnemonic,
      savePassword,
      saveMnemonic,
      setNets,
      setType,
      createWallets,
      walletOpts,
      newWallets,
      isUserMnemonic,
      isPasswordHash,
      redirectToNewWallet,
    } = useCreateWallets();
    const store = useStore();
    onMounted(() => {
      store.commit('newWallets/setCatPageProps', {
        dataQa: 'add-address__one-seed',
      });
    });

    const finalStep = (nets) => {
      store.commit('newWallets/setLoader', true);
      isUserMnemonic.value && setMnemonic();
      setNets(nets);
      setType('oneSeed');
      createWallets(WALLET_TYPES.ONE_SEED).then(async (success) => {
        if (success) {
          !isUserMnemonic.value && saveMnemonic();
          !isPasswordHash.value && savePassword();
          await redirectToNewWallet();
          store.commit('newWallets/setNewWalletsList', newWallets.value);
          store.commit('newWallets/setModal', true);
          store.commit('newWallets/setLoader', false);
        }
      });
    };

    const { currentStep, steps } = useCurrentStep(
      1,
      isUserMnemonic.value ? stepsOneSeed : stepsOneSeed1
    );

    return {
      steps,
      currentStep,
      isUserMnemonic,
      isPasswordHash,
      walletOpts,
      setPassword,
      setMnemonic,
      newWallets,
      finalStep,
    };
  },
};
</script>

<style lang="scss" scoped>
.add-to-one-seed {
  display: flex;
  flex-direction: column;
  background: $white;
  box-shadow: -10px 4px 27px rgba(0, 0, 0, 0.1);
  border-radius: 25px;
  flex-grow: 1;
  padding: 0 44px;
  height: 100%;

  // calc(100vh - 114px);
  margin-bottom: 8px;

  @include lg {
    padding: 0 40px;
  }
  @include md {
    padding: 0 31px;
    height: calc(100vh - 82px);
    box-shadow: -10px 4px 24px rgba(0, 0, 0, 0.1);
  }
  &__section {
    overflow: hidden;
    display: flex;
    flex-grow: 1;
  }
}
</style>
