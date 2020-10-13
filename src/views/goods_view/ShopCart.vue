<template>
  <div class="shopcart">
    <div class="shopcart-content">
      <div class="shopcart-content-left" @click="toggleShowList">
        <span class="shopcart-icon" :class="{active: totalCount > 0}">
          <van-icon class-prefix="icon-shopping_cart" :badge="totalCount" />
        </span>
        <span class="total-price" :class="{active: totalCount > 0}">￥{{totalPrice}}</span>
        <span class="delivery-price">另需配送费￥{{seller.deliveryPrice}}元</span>
      </div>
      <div class="shopcart-buy-btn" :class="{enough: totalPrice >= seller.minPrice}">{{buyBtnText}}</div>
    </div>
    <div class="shopcart-list" v-show="showList">
      <p class="shopcart-list-header">
        购物车
        <span class="empty" @click="$emit('empty')">清空</span>
      </p>
      <div class="shopcart-list-content" ref="shopCartList">
        <ul>
          <li v-for="f in shopCartArray" class="shopcart-list-item" :key="f.name">
            <div class="name">{{f.name}}</div>
            <div class="price">{{f.price}}</div>
            <CountControl :food="f" @add-count="add(f)" @minus-count="minus(f)" />
          </li>
        </ul>
      </div>
    </div>
    <div class="cover" v-show="showList" @click="closeShowList"></div>
  </div>
</template>

<script>
import CountControl from "./CountControl";
import BScroll from "better-scroll";

export default {
  props: {
    seller: {
      type: Object,
      require: true,
    },
    goods: {
      type: Array,
      require: true,
    },
  },
  data() {
    return {
      showList: false,
    };
  },
  computed: {
    // 通过父组件传递进来的goods所有商品,遍历生成一个购物车数组
    shopCartArray() {
      let result = [];
      // 商品在不同分类中可能有同名商品,这种同名商品只需要添加一个到购物车数组就够了
      for (let i = 0; i < this.goods.length; i++) {
        let { foods } = this.goods[i];
        for (let j = 0; j < foods.length; j++) {
          let f = foods[j];
          // 首先判断当前商品是否已经有同名商品添加到购物车数组了,已经有就不添加了
          let index = result.findIndex(({ name }) => name === f.name);
          // 该商品还未加入到数组中,并且该商品在购物车的数量大于0
          if (index === -1 && f.count > 0) {
            result.push(f);
          }
        }
      }

      return result;
    },
    // 通过购物车数组计算出,一共有多少商品在购物车中
    totalCount() {
      let totalCount = 0;
      this.shopCartArray.forEach((f) => (totalCount += f.count));
      return totalCount || "";
    },
    // 通过购物车数组计算出,购物车中商品的总价
    totalPrice() {
      let totalPricet = 0;
      this.shopCartArray.forEach((f) => (totalPricet += f.count * f.price));
      return totalPricet;
    },
    // 根据商品总价计算当前购买按钮的文本内容
    buyBtnText() {
      let { minPrice } = this.seller;
      let text = `￥${minPrice}元起送`;
      if (this.totalPrice > 0 && this.totalPrice < minPrice) {
        text = `还差￥${minPrice - this.totalPrice}元起送`;
      }
      if (this.totalPrice >= minPrice) {
        text = "立即购买";
      }
      return text;
    },
  },
  methods: {
    add(f) {
      this.$emit("add-count", f);
    },
    minus(f) {
      this.$emit("minus-count", f);
    },
    toggleShowList() {
      // 显示但是购物车没商品
      if (!this.totalCount && !this.showList) {
        return;
      }
      // 购物车有商品可以显示可以隐藏
      if (this.totalCount) {
        this.showList = !this.showList;
      }
    },
    closeShowList() {
      this.showList = false;
    },
  },
  watch: {
    // 监听购物车数量,当数量为0时自动隐藏罩层
    totalCount(newCount, oldCount) {
      if (newCount !== oldCount && !newCount) {
        this.showList = false;
      }

      if (newCount !== oldCount && this.showList) {
        this.$nextTick(() => {
          this.shopCartScroll.refresh();
        });
      }
    },
    // 监听购物车列表元素的显示隐藏,当购物车列表显示时刷新或者实例化 BScroll
    showList(newShow, oldShow) {
      if (newShow !== oldShow && newShow) {
        // 直接实例化列表是不能滑动,数据刚改变时页面的更新渲染还没有完成,
        // BScroll不能计算出正确的内容高度,这里需要等待页面渲染完毕
        this.$nextTick(() => {
          if (this.shopCartScroll) {
            this.shopCartScroll.refresh();
          } else {
            this.shopCartScroll = new BScroll(this.$refs.shopCartList, {
              click: true,
              bounce: false, // 不允许弹簧效果
            });
          }
        });
      }
    },
  },
  components: {
    CountControl,
  },
};
</script>

<style lang="scss" scoped>
.shopcart {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 20;
  height: 46px;

  .shopcart-content {
    display: flex;
    position: relative;
    z-index: 30;
    width: 100%;
    height: 100%;
    background-color: #141d27;

    .shopcart-content-left {
      flex: 1;
      padding: 12px;

      .shopcart-icon {
        display: inline-block;
        position: relative;
        top: -22px;
        border: 6px solid #141d27;
        border-radius: 50%;
        height: 56px;
        width: 56px;
        text-align: center;
        background-color: #2b333b;

        .icon-shopping_cart {
          font-size: 24px;
          line-height: 44px;
          color: rgba(255, 255, 255, 0.4);
        }

        &.active {
          background-color: rgb(0, 160, 220);

          .icon-shopping_cart {
            color: #fff;
          }
        }
      }

      .total-price {
        display: inline-block;
        border-right: 1px solid rgba(255, 255, 255, 0.1);
        padding: 0 12px;
        height: 22px;
        font-size: 16px;
        font-weight: 700;
        line-height: 22px;
        vertical-align: top;
        color: rgba(255, 255, 255, 0.4);

        &.active {
          color: #fff;
        }
      }

      .delivery-price {
        margin-left: 12px;
        font-size: 12px;
        font-weight: 200;
        line-height: 22px;
        vertical-align: top;
        color: rgba(255, 255, 255, 0.4);
      }
    }

    .shopcart-buy-btn {
      flex: 0 0 105px;
      padding: 0 8px;
      font-size: 12px;
      font-weight: 700;
      line-height: 46px;
      text-align: center;
      color: rgba(255, 255, 255, 0.4);
      background-color: #2b333b;

      &.enough {
        color: #fff;
        background-color: #00b43c;
      }
    }
  }

  .shopcart-list {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    z-index: 15;
    transform: translateY(-100%);

    .shopcart-list-header {
      border-bottom: 1px solid rgba(7, 17, 27, 0.1);
      padding: 0 18px;
      height: 40px;
      font-size: 14px;
      font-weight: 200;
      line-height: 40px;
      color: rgb(7, 17, 27);
      background: #f3f5f7;

      .empty {
        float: right;
        font-size: 12px;
        color: rgb(0, 160, 220);
      }
    }

    .shopcart-list-content {
      overflow: hidden;
      padding: 0 18px;
      max-height: 270px;
      background-color: #fff;
    }

    .shopcart-list-item {
      display: flex;
      border-bottom: 1px solid rgba(7, 17, 27, 0.1);
      padding: 12px 0;
      height: 48px;
      line-height: 24px;

      .name {
        flex: 1;
        font-size: 14px;
        color: rgb(7, 17, 27);
      }

      .price {
        position: relative;
        margin: 0 12px 0 18px;
        padding-left: 10px;
        font-size: 14px;
        font-weight: 700;
        color: rgb(240, 20, 20);

        &:before {
          position: absolute;
          left: 0;
          font-size: 20px;
          transform-origin: left;
          transform: scale(0.5);
          content: "￥";
        }
      }
    }
  }

  .cover {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 10;
    background: rgba(7, 17, 27, 0.6);
  }
}
</style>