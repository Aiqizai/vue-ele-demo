<template>
  <div class="ratings-filter">
    <div class="filter-btns">
      <span
        class="btn positive"
        @click="$emit('set-select', 'all')"
        :class="{active: select === 'all'}"
      >{{all}}<i>{{ratingCount.all}}</i> </span>
      <span
        class="btn positive"
        @click="$emit('set-select', 'positive')"
        :class="{active: select === 'positive'}"
      >{{positive}}<i>{{ratingCount.positive}}</i></span>
      <span
        class="btn negative"
        @click="$emit('set-select', 'negative')"
        :class="{active: select === 'negative'}"
      >{{negative}}<i>{{ratingCount.negative}}</i></span>
    </div>
    <div class="only-content" :class="{active: onlyContent}">
      <i class="icon-check_circle" @click="$emit('toggle-only-content')" />只看有内容的评价
    </div>
  </div>
</template>

<script>
export default {
  props: {
    all: {
      type: String,
      default: "全部",
    },
    positive: {
      type: String,
      default: "满意",
    },
    negative: {
      type: String,
      default: "不满意",
    },
    select: {
      type: String,
      default: "all",
    },
    onlyContent: {
      type: Boolean,
      default: false,
    },
    ratings: {
      type: Array,
      default() {
          return []
      }
    },
  },
  computed: {
    ratingCount() {
      let result = {
        all: this.ratings.length,
        positive: 0,
        negative: 0,
      };

      this.ratings.forEach((r) => {
        if (r.rateType === 1) {
          // 差评
          result.negative++;
        } else {
          result.positive++;
        }
      });

      return result
    }
  }
};
</script>

<style lang="scss" scoped>
.filter-btns {
  padding: 18px 0;
  border-bottom: 1px solid rgba(7, 17, 27, 0.1);

  .btn {
    display: inline-block;
    position: relative;
    margin-right: 8px;
    border-radius: 2px;
    padding: 8px 26px 8px 12px;
    font-size: 12px;
    line-height: 16px;
    color: rgb(77, 85, 93);

    i {
        position: absolute;
        right: 12px;
        bottom: 8px;
        font-size: 16px;
        transform-origin: right;
        transform: scale(0.5);
    }

    &.positive {
      background-color: rgba(0, 160, 220, 0.2);

      &.active {
        color: #fff;
        background-color: rgb(0, 160, 220);
      }
    }

    &.negative {
      background-color: rgba(77, 85, 93, 0.2);

      &.active {
        color: #fff;
        background-color: rgb(77, 85, 93);
      }
    }
  }
}

.only-content {
  padding: 12px 0;
  font-size: 12px;
  line-height: 24px;
  color: rgb(147, 153, 159);

  .icon-check_circle {
    display: inline-block;
    margin-right: 4px;
    font-size: 24px;
    vertical-align: top;
  }

  &.active {
    color: rgb(77, 85, 93);

    .icon-check_circle {
      color: #00b43c;
    }
  }
}
</style>