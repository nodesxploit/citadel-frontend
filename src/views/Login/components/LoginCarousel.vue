<template>
  <div class="login-carousel">
    <el-carousel
      ref="loginCarousel"
      v-bind="carouselProps"
      @change="setActiveItem"
    >
      <LoginCarouselItem
        v-for="{ name, image } of slides"
        :key="name"
        :image="image"
        :title="$t(`login.carousel.${name}.title`)"
        :text="$t(`login.carousel.${name}.text`)"
      />
    </el-carousel>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount, onUnmounted } from 'vue';
import LoginCarouselItem from './LoginCarouselItem';

export default {
  name: 'LoginCarousel',
  components: { LoginCarouselItem },
  setup() {
    const loginCarousel = ref(null);
    const carouselHeight = ref();
    const activeItem = ref(0);
    const intervalID = ref(null);
    const screenWidth = ref(window.innerWidth);

    const onScreenWidthChange = () => {
      screenWidth.value = window.innerWidth;

      // set carousel height
      if (screenWidth.value < 1280) {
        carouselHeight.value = 400;
      } else {
        carouselHeight.value = 500;
      }
    };
    const carouselProps = computed(() => ({
      height: `${carouselHeight.value}px`,
      arrow: 'never',
      indicatorPosition: 'outside',
      trigger: 'click',
      autoplay: false,
    }));

    const slides = ref([
      {
        name: 'stake',
        image: '1',
      },
      {
        name: 'xtc',
        image: '2',
      },
      {
        name: 'dao',
        image: '3',
      },
      {
        name: 'buy',
        image: '4',
      },
      {
        name: 'useCases',
        image: '5',
      },
      {
        name: 'keep',
        image: '6',
      },
    ]);

    carouselHeight.value = 600;
    onMounted(() => {
      window.addEventListener('resize', onScreenWidthChange);

      if (screenWidth.value < 1280) {
        carouselHeight.value = 400;
      } else {
        carouselHeight.value = 500;
      }

      // set random item
      startCarousel();
    });
    onUnmounted(() =>
      window.removeEventListener('resize', onScreenWidthChange)
    );
    const setRandomItem = () => {
      const randomIndex = Math.floor(Math.random() * slides.value.length);
      const isLastItem = randomIndex === activeItem.value;
      const newActiveIndex =
        randomIndex !== activeItem.value
          ? randomIndex
          : randomIndex === isLastItem
          ? 0
          : randomIndex + 1;

      loginCarousel.value.setActiveItem(newActiveIndex);
    };

    const startCarousel = () => {
      intervalID.value = setInterval(setRandomItem, 5000);
    };

    const stopCarousel = () => {
      clearInterval(intervalID.value);
    };

    const setActiveItem = (index) => {
      stopCarousel();
      activeItem.value = index;
      startCarousel();
    };

    onBeforeUnmount(() => {
      stopCarousel();
    });

    return {
      loginCarousel,
      carouselProps,
      slides,
      setActiveItem,
    };
  },
};
</script>

<style lang="scss" scoped>
.login-carousel {
  width: 650px;
  display: flex;
  flex-direction: column;
  margin-right: 190px;

  @include lg {
    width: 500px;
    margin-right: 63px;
  }

  @include md {
    width: 400px;
    margin-right: 27px;
  }
}
</style>

<!-- for el-carousel nav -->
<style lang="scss">
.login-carousel {
  .el-carousel {
    &__indicators {
      display: flex;
      justify-content: center;
      margin: 25px 0 10px;
      padding: 5px;

      @include lg {
        margin: 10px 0;
      }
    }

    &__indicator {
      padding: 6px;

      &:hover {
        button {
          opacity: 1;
          background-color: $blue;

          &::after {
            content: '';
          }
        }
      }

      & button {
        position: relative;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: $too-ligth-blue;
        opacity: 1;

        &::after {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 5px 10px #00000029;
          background-color: $white;
          z-index: -1;
        }
      }

      &.is-active {
        button {
          background-color: $dark-blue;

          &::after {
            content: '';
            position: absolute;
            border-radius: 50%;
            top: 50%;
            left: 50%;
            width: 20px;
            height: 20px;
            transform: translate(-50%, -50%);
            border: 1px solid $dark-blue;
          }
        }
      }
    }
  }
}

.el-carousel__container {
  min-height: 538px !important;

  @include md {
    min-height: 450px !important;
  }
}
</style>
