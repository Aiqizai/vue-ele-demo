<template>
  <div class="good-detail">
    <i class="nav-back icon-arrow_lift" @click="navGoBack"></i>
    <img class="good-detail-image" :src="food.image" alt="商品图片"/>
    <div class="good-detail-container">
      <h3 class="good-detail-name">{{ food.name }}</h3>
      <p class="good-detail-desc">月售{{ food.sellCount }}份 好评率{{ food.rating }}%</p>
      <p class="good-detail-price">
        <span class="new-price">{{ food.price }}</span>
        <span class="old-price" v-if="food.oldPrice">
          <i>{{ food.oldPrice }}</i>
        </span>
      </p>
      <div class="control-wrapper">
        <span class="add-cart" @click="addFood" v-show="!food.count"/>
        <CountControl
            v-show="food.count"
            :food="food"
            @add-count="addFood"
            @minus-count="minusFood"
        />
      </div>
    </div>
    <!-- 商品介绍 -->
    <WhiteSpace v-if="food.info"/>
    <div class="good-detail-container" v-if="food.info">
      <h4 class="good-detail-title">商品介绍</h4>
      <p class="good-detail-info">{{ food.info }}</p>
    </div>
    <!--商品评价  -->
    <WhiteSpace/>
    <div class="good-detail-container">
      <h4 class="good-detail-title">商品评价</h4>
      <RatingsFilter
          positive="推荐"
          negative="吐槽"
          :select="select"
          :onlyContent="onlyContent"
          :ratings="food.ratings"
          @set-select="setSelect"
          @toggle-only-content="toggleOnlyContent"
      />
      <!-- 评价列表 -->
      <ul>
        <li v-for="(r,i) in filterRatings" class="rating-list" :key="i">
          <p class="rate-date">{{ r.rateTime|getTemplateTimeByDate('YYYY-MM-dd hh:mm') }}</p>
          <p class="rate-text">
            <i class="icon" :class="r.rateType === 1 ? 'icon-thumb_down':'icon-thumb_up'"/>
            {{ r.text }}
          </p>
          <div class="rate-user">
            {{ r.username }}
            <img class="avatar" :src="r.avatar" alt="用户">
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import CountControl from "../CountControl";
import WhiteSpace from "../../../components/WhiteSpace";
import RatingsFilter from "../../../components/RatingsFilter";
import {getTemplateTimeByDate} from '../../../assets/js/tool'

/*
 *@desc 显示所有评论
 *@constant {string}
 */
const ALL = "all";
/*
 *@desc 显示所有好评
 *@constant {string}
 */
const POSITIVE = 'positive'
/*
 *@desc 显示所有差评
 *@constant {string}
 */
const NEGATIVE = 'negative'

export default {
  props: {
    food: {
      type: Object,
      require: true,
    },
  },
  data() {
    return {
      select: ALL, // 选择当前评价是好评, 差评, 全部
      onlyContent: false, // 是否只显示有内容的评价
    };
  },
  methods: {
    navGoBack() {
      this.$router.go(-1);
    },
    addFood() {
      this.$emit("add-count", this.food);
    },
    minusFood() {
      this.$emit("minus-count", this.food);
    },
    setSelect(select) {
      this.select = select;
    },
    toggleOnlyContent() {
      this.onlyContent = !this.onlyContent;
    },
  },
  computed: {
    filterRatings() {
      return this.food.ratings.filter(r => {
        // 过滤没有内容的评价
        if (this.onlyContent && !r.text) {
          return false
        }
        // 当选择好评时保留 rateType 等于 0 的评论
        if (this.select === POSITIVE) {
          return r.rateType === 0
        }
        // 当选择差评时保留 rateType 等于 1 的评论
        if (this.select === NEGATIVE) {
          return r.rateType === 1
        }
        // All保留全部
        return true
      })
    }
  },
  components: {
    CountControl,
    WhiteSpace,
    RatingsFilter,
  },
  filters: {
    getTemplateTimeByDate
  },
  // 路由守卫解决用户强制访问当前页面,当前页面只能通过路由点击跳转访问
  beforeRouteEnter(to, from, next) {
    console.log(to, 123);
    if (to.params.food) {
      next();
    } else {
      next("/");
    }
  }
};
</script>

<style lang="scss" scoped>
.good-detail {
  overflow: auto;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 46px;
  left: 0;
  background: #eee;

  .nav-back {
    display: block;
    position: absolute;
    top: 10px;
    left: 10px;
    border-radius: 50%;
    width: 25px;
    height: 25px;
    line-height: 25px;
    text-align: center;
    color: #fff;
    background: rgba(7, 17, 27, 0.4);
  }

  .good-detail-image {
    display: block;
    width: 100vw;
    height: 325px;
  }

  .good-detail-container {
    position: relative;
    padding: 18px;
    background-color: #fff;

    .good-detail-name {
      font-size: 14px;
      font-weight: 700;
      line-height: 14px;
      color: rgb(7, 17, 27);
    }

    .good-detail-desc {
      margin-top: 8px;
      font-size: 12px;
      line-height: 12px;
      color: rgb(147, 153, 159);
    }

    .good-detail-price {
      margin-top: 18px;
    }

    .new-price {
      position: relative;
      padding-left: 10px;
      font-size: 14px;
      font-weight: 700;
      line-height: 24px;
      color: rgb(240, 20, 20);

      &:before {
        position: absolute;
        left: 0;
        font-size: 20px;
        font-weight: normal;
        transform-origin: left;
        transform: scale(0.5);
        content: "￥";
      }
    }

    .old-price {
      position: relative;
      margin-left: 6px;
      color: rgb(147, 153, 159);

      i {
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        font-size: 20px;
        line-height: 24px;
        font-weight: 700;
        text-decoration: line-through;
        transform-origin: left top;
        transform: scale(0.5);

        &:before {
          content: "￥";
        }
      }
    }

    .control-wrapper {
      position: absolute;
      right: 18px;
      bottom: 18px;

      .add-cart {
        display: block;
        border-radius: 12px;
        padding: 6px 12px;
        width: 74px;
        height: 24px;

        color: #fff;
        background-color: rgb(0, 160, 220);

        &:before {
          display: block;
          font-size: 20px;
          white-space: nowrap;
          transform-origin: left top;
          transform: scale(0.5);
          content: "加入购物车";
        }
      }
    }

    .good-detail-title {
      font-size: 14px;
      line-height: 14px;
      color: rgb(7, 17, 27);
    }

    .good-detail-info {
      margin-top: 6px;
      padding: 8px;
      font-size: 12px;
      font-weight: 200;
      line-height: 24px;
      color: rgb(77, 85, 93);
    }

    .rating-list {
      position: relative;
      border-bottom: 1px solid rgba(7, 17, 27, 0.1);
      padding: 16px 0;

      .rate-date {
        font-size: 10px;
        line-height: 12px;
        color: rgb(147, 153, 159);
      }

      .rate-text {
        margin-top: 6px;
        font-size: 12px;
        line-height: 16px;
        color: rgb(7, 17, 27);

        .icon {
          margin-right: 4px;
        }

        .icon-thumb_down {
          color: rgb(147, 153, 159);
        }

        .icon-thumb_up {
          color: rgb(0, 160, 220);
        }

      }

      .rate-user {
        position: absolute;
        top: 16px;
        right: 0;
        height: 12px;
        font-size: 10px;
        line-height: 12px;
        color: rgb(147, 153, 159);

        .avatar {
          display: inline-block;
          margin-left: 6px;
          border-radius: 50%;
          width: 12px;
          height: 12px;
          vertical-align: top;
        }
      }
    }

  }
}
</style>