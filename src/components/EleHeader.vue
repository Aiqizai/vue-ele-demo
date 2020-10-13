<template>
  <div class="el-header">
    <div class="el-header-desc">
      <!--骨架的显示隐藏, 当seller数据请求完毕后,隐藏骨架  -->
      <van-skeleton
        avatar
        :loading="!seller.name"
        avatar-shape="square"
        avatar-size="64px"
        :row="3"
      >
        <div class="van-skeleton">
          <img
            class="van-skeleton__avatar van-skeleton__avatar--square el-header-avatar"
            style="width: 64px; height: 64px;"
            :src="seller.avatar"
          />

          <div class="van-skeleton__content">
            <h2 class="van-skeleton__row el-header-name">
              <span class="el-header-brand" />
              {{seller.name}}
            </h2>
            <div
              class="van-skeleton__row el-header-delivery"
            >{{seller.description}}/{{seller.deliveryTime}}分钟送达</div>
            <transition-group
              tag="ul"
              class="van-skeleton__row el-header-supports"
              name="slider"
              v-if="seller.supports&&seller.supports.length"
            >
              <li
                class="supports-item"
                v-for="(item,index) in seller.supports"
                v-show="currentIndex === index"
                :key="item.type"
              >
                <SupportIcon :type="item.type" :kind="1" />
                {{item.description}}
              </li>
            </transition-group>
          </div>
        </div>
        <span class="support-count" v-if="seller.supports&&seller.supports.length" @click="showDetailCoverFunc">
          {{seller.supports.length}}个
          <i class="icon-keyboard_arrow_right" />
        </span>
      </van-skeleton>
    </div>
    <div class="el-header-bulletin" @click="showDetailCoverFunc">
      <span class="bulletin-icon"></span>
      {{seller.bulletin}}
    </div>
    <div class="el-header-bg">
      <img :src="seller.avatar" alt="background" />
    </div>
    <transition name="fade">
        <DetailCover v-show="showDetailCover" :seller="seller" @close-detail-cover="hiddenDetailCoverFunc"/>
    </transition>
  </div>
</template>

<script>
import SupportIcon from "./SupportIcon";
import DetailCover from "./DetailCover"

export default {
  props: {
    seller: Object,
  },
  data() {
    return {
      currentIndex: 0,
      showDetailCover: false,
    };
  },
  // 启动轮播图，注意这里的轮播图是等待网路数据请求完毕后。他是在mounted之后(mounted)时seller为空
  // 这里要比较seller的变化所以需要用到watch
  watch: {
    seller(newSeller, oldSeller) {
      // 先判断 seller 是否发生改变, 并且优惠详情是否改变
      if (
        newSeller !== oldSeller &&
        newSeller.supports !== oldSeller.supports
      ) {
        //  清除上一次的轮播图
        if (this.timer) {
          clearInterval(this.timer);
          this.currentIndex = 0;
        }

        // seller supports发生改变
        if (newSeller.supports?.length > 1) {
          // 等待页面渲染完毕, 优惠数量大于1才开启轮播
          this.$nextTick(() => {
            this.timer = setInterval(() => {
              this.currentIndex =
                (this.currentIndex + 1) % newSeller.supports.length;
            }, 1000);
          });
        }
      }
    },
  },

  methods: {
    // 开启轮播图
    startCarouser() {
      // 判断本次页面更新是不是seller.supports 发生改变
    },
    // 显示详情罩层
    showDetailCoverFunc() {
        this.showDetailCover = true
    },
    //隐藏详情罩层
      hiddenDetailCoverFunc() {
        this.showDetailCover = false
    }
  },

  // 因为watch开启了 window 计时器,需要在组件被卸载时清理掉
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  components: {
    SupportIcon,
    DetailCover
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/styles/mixins";

.el-header {
  position: relative;
  background-color: rgba(7, 17, 17, 0.5);

  .el-header-desc {
    position: relative;
    padding: 24px 12px 18px 24px;

    /*修改vant 骨架自带样式 */
    .van-skeleton {
      padding: 0;

      .van-skeleton__avatar + .van-skeleton__content {
        padding-top: 2px;
      }

      .el-header-avatar {
        border-radius: 2px;
      }

      .el-header-name {
        height: 18px;
        font-size: 16px;
        font-weight: bold;
        line-height: 18px;
        color: #fff;
        background-color: transparent;
      }

      .el-header-brand {
        @include bg-img("../assets/images/brand", 30px, 18px);

        margin-right: 6px;
        vertical-align: top;
      }

      .el-header-delivery {
        margin-top: 8px;
        font-size: 12px;
        font-weight: 200;
        line-height: 12px;
        color: #fff;
        background-color: transparent;
      }

      .el-header-supports {
        overflow: hidden;
        position: relative;
        margin-top: 10px;
        background-color: transparent;
      }

      .supports-item {
        overflow: hidden;
        position: absolute;
        top: 0;
        left: 0;
        font-size: 10px;
        font-weight: 200;
        line-height: 12px;
        white-space: nowrap;
        text-overflow: ellipsis;
        color: #fff;

        &.slider-enter {
          transform: translateY(-110%);
        }

        &.slider-enter-active,
        &.slider-leave-active {
          transition: all 0.5s linear;
        }

        &.slider-enter-to,
        &.slider-leave {
          transform: translateY(0);
        }

        &.slider-leave-to {
          transform: translateY(110%);
        }
      }
    }

    .support-count {
      display: block;
      position: absolute;
      right: 12px;
      bottom: 18px;
      border-radius: 12px;
      padding: 7px 8px;
      height: 24px;
      font-size: 10px;
      font-weight: 200;
      line-height: 12px;
      color: #fff;
      background-color: rgba(0, 0, 0, 0.2);
    }
  }

  .el-header-bulletin {
    overflow: hidden;
    position: relative;
    padding: 0 18px 0 12px;
    height: 28px;
    font-size: 10px;
    font-weight: 200;
    line-height: 28px;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: #fff;
    background-color: rgba(7, 17, 17, 0.2);

    .bulletin-icon {
      @include bg-img("../assets/images/bulletin", 22px, 12px);

      margin-right: 4px;
    }
  }

  .el-header-bg {
    overflow: hidden;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
    filter: blur(10px);
    img {
      width: 100%;
    }
  }

  .fade-enter,
  .fade-leave-to {
      opacity: 0;
  }

  .fade-enter-active,
  .fade-leave-active {
      transition: opacity .5s linear;
  }

  .fade-enter-to,
  .fade-leave {
      opacity: 1;
  }
}
</style>