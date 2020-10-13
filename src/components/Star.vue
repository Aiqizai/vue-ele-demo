<template>
  <div class="star" :class="'star-'+type">
    <span class="star-item" v-for="(s,i) in starArr" :key="i" :class="s" />
  </div>
</template>

<script>
/*
 *@desc 评星系统几分制
 *@constant {number}
 */
const STAR_COUNT = 5;
/*
 *@desc 评星空星类名
 *@constant {string}
 */
const STAR_OFF = "off";
/*
 *@desc 评星半星类名
 *@constant {string}
 */
const STAR_HALF = "half";
/*
 *@desc 评星全星类名
 *@constant {string}
 */
const STAR_ON = "on";

export default {
  props: {
    type: {
      type: String,
      default: "48",
    },
    score: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    // 将score转化为展示在页面上列表渲染的评星数组
    starArr() {
      // 评分规矩 4.8 四星半 4.5 四星半 4.2四星
      let score = Math.floor(this.score * 2) / 2; // 将大于等于0.5小数转化成0.5, 小于0.5小数转化成0
      let result = [];

      for (let i = 0; i < STAR_COUNT; i++) {
        if (Math.floor(score) > i) {
          // 3.5 -> 3  0 1 2 添加全星
          result.push(STAR_ON);
        } else if (score > i && Math.floor(score) === i) {
          // 3.5 > 3   Math.floor(3.5) === 3  //添加半星
          result.push(STAR_HALF);
        } else {
          // 添加空星
          result.push(STAR_OFF);
        }
      }

      return result;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../assets/styles/mixins";
$imgPath: "../assets/images/";

.star {
  display: inline-block;

  &.star-48 {
    .star-item {
      display: inline-block;
      margin-right: 16px;
      width: 20px;
      height: 20px;

      &:last-child {
        margin-right: 0;
      }
    }

    .on {
      @include bg-img("#{$imgPath}star48_on", 20px, 20px);
    }

    .off {
      @include bg-img("#{$imgPath}star48_off", 20px, 20px);
    }

    .half {
      @include bg-img("#{$imgPath}star48_half", 20px, 20px);
    }
  }

  &.star-36 {
    .star-item {
      display: inline-block;
      margin-right: 6px;
      width: 15px;
      height: 15px;

      &:last-child {
        margin-right: 0;
      }
    }

    .on {
      @include bg-img("#{$imgPath}star36_on", 15px, 15px);
    }

    .off {
      @include bg-img("#{$imgPath}star36_off", 15px, 15px);
    }

    .half {
      @include bg-img("#{$imgPath}star36_half", 15px, 15px);
    }
  }

  &.star-24 {
    .star-item {
      display: inline-block;
      margin-right: 2px;
      width: 10px;
      height: 10px;

      &:last-child {
        margin-right: 0;
      }
    }

    .on {
      @include bg-img("#{$imgPath}star24_on", 10px, 10px);
    }

    .off {
      @include bg-img("#{$imgPath}star24_off", 10px, 10px);
    }

    .half {
      @include bg-img("#{$imgPath}star24_half", 10px, 10px);
    }
  }
}
</style>