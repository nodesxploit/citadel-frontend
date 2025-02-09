<template>
  <div class="cross-chain-card" :class="visibleClass">
    <div class="cross-chain-card__img">
      <component v-bind:is="`${currentIcon}`"></component>
    </div>
    <div class="cross-chain-card__content">
      <h4 class="title">
        {{ $t('settings.crossChain.title') }}
      </h4>
      <span class="description">
        {{ $t(`settings.crossChain.${currentDescKey}`) }}
      </span>
    </div>
    <PrimaryButton class="cross-chain-card__button" :disabled="isDisabled">
      {{ $t('settings.crossChain.button') }}
    </PrimaryButton>
  </div>
</template>

<script>
import PrimaryButton from '@/components/UI/PrimaryButton';
import CrossChainIcon from '@/assets/icons/settings/cross-chain.svg';
import CrossChainDisabledIcon from '@/assets/icons/settings/cross-chain-disabled.svg';

export default {
  name: 'CrossChain',
  components: {
    PrimaryButton,
    CrossChainIcon,
    CrossChainDisabledIcon,
  },
  props: {
    visibleClass: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    let currentIcon = 'CrossChainIcon';
    let currentDescKey = 'description';
    let isDisabled = false;
    if (props.visibleClass == 'comingSoon') {
      currentIcon = 'CrossChainDisabledIcon';
      currentDescKey = 'comingSoon';
      isDisabled = true;
    }
    return {
      currentIcon,
      currentDescKey,
      isDisabled,
    };
  },
};
</script>
<style lang="scss" scoped>
.cross-chain-card {
  @include settings-card-default;

  &.comingSoon {
    background: $white;
  }

  background: linear-gradient(90deg, #ebd7ff 0%, #c6e2ff 100%);
  position: relative;
  z-index: 1;

  min-height: 80px;
  height: fit-content;

  overflow: hidden;

  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;

  @include laptop-l {
    // height: 100px;
  }
  &.comingSoon::before {
    background: none;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
    background-image: url('~@/assets/images/settings/left-blob.png'),
      url('~@/assets/images/settings/bottom-right-blob.png');
    background-repeat: no-repeat, no-repeat;
    background-position: left, bottom right;
    background-size: auto;
    @include lg {
      background-size: 180%, 100%;
    }
  }

  &__img {
    width: 60px;
    height: 60px;
    @include laptop-l {
      width: 48px;
      height: 48px;
      svg {
        transform: scale(0.85);
      }
    }
    @include laptop-l {
      align-self: flex-start;
    }
    @include xs-lg {
      align-self: flex-start;
    }
  }

  &__content {
    width: 50%;
    line-height: 1.5;
    margin-left: 25px;
    margin-right: auto;

    & > * {
      margin: 0;
    }

    .title {
      @include title-default;
    }
    .description {
      @include text-default;
      color: #0a2778;
      margin: 5px 0 0;
      display: block;
    }
  }

  &__button {
    @include btn-default;
    align-self: center;
    margin-left: auto;
  }

  @include laptop-l {
    flex-wrap: nowrap;
    &::before {
      background-size: auto;
    }
  }
}
</style>
