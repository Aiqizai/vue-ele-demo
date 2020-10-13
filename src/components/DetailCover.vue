<template>
  <div class="detail-cover">
    <h2 class="detail-cover-name">{{seller.name}}</h2>
    <div class="star-wrapper">
      <Star :score="seller.score" />
    </div>
    <div v-if="seller.supports && seller.supports.length">
      <div class="detail-cover-title">
        <span class="line" />
        <span class="text">优惠信息</span>
        <span class="line" />
      </div>
      <ul class="detail-cover-content">
        <li v-for="(s,i) in seller.supports" :key="i" class="support-item">
          <SupportIcon :type="s.type" :kind="2" />
          <span class="text">{{s.description}}</span>
        </li>
      </ul>
    </div>

    <div class="detail-cover-title">
      <span class="line" />
      <span class="text">商家公告</span>
      <span class="line" />
    </div>

    <div class="detail-cover-content">{{seller.bulletin}}</div>

    <i class="icon-close" @click="closeDetailCover" />
  </div>
</template>

<script>
import Star from "./Star";
import SupportIcon from "./SupportIcon";

export default {
  props: {
    seller: {
      type: Object,
      require: true,
    },
  },
  methods: {
    closeDetailCover() {
      this.$emit("close-detail-cover");
    },
  },
  components: {
    Star,
    SupportIcon,
  },
};
</script>

<style lang="scss" scoped>
.detail-cover {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 20;
  padding: 64px 36px;
  min-height: 100vh;
  color: #fff;
  background-color: rgba(7, 17, 27, 0.8);

  .detail-cover-name {
    margin-bottom: 16px;
    font-size: 16px;
    font-weight: 700;
    line-height: 16px;
    text-align: center;
  }

  .star-wrapper {
    text-align: center;
  }

  .detail-cover-title {
    display: flex;
    margin: 28px 0 24px;

    .line,
    .text {
      display: block;
      font-size: 14px;
      font-weight: 700;
      line-height: 14px;
    }

    .line {
      flex: 1;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      transform: translateY(-6.5px);
    }

    .text {
      margin: 0 12px;
    }
  }

  .detail-cover-content {
    padding: 0 12px;
    font-size: 12px;
    font-weight: 200;
    line-height: 24px;

    .support-item {
      margin-bottom: 12px;
      line-height: 16px;

      &:last-child {
        margin-bottom: 0;
      }

      .text {
        margin-left: 6px;
        white-space: nowrap;
      }
    }
  }

  .icon-close {
    position: absolute;
    left: 50%;
    bottom: 32px;
    font-size: 32px;
    color: rgba(255, 255, 255, 0.5);
    transform: translateX(-50%);
  }
}
</style>