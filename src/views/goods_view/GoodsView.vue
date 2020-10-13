<template>
  <div class="good-view">
    <!-- 加载特效页面  -->
    <van-empty v-if="loading" :image="image">
      <p class="refresh-text" v-if="refreshText">
        网络异常,请点击
        <i class="refresh" @click="refreshData">刷新</i>
      </p>
    </van-empty>
    <!-- 商品列表 -->
    <div class="goods-container">
      <div class="menu-list" ref="menuList">
        <ul>
          <li
            class="menu-list-item border-bottom-1px"
            v-for="(g,index) in goods"
            :class="{active: index === currentIndex}"
            :key="index"
            @click="scrollToFoods(index)"
          >
            <span class="menu-list-item-text">
              <SupportIcon :type="g.type" :kind="3" />
              {{g.name}}
            </span>
          </li>
        </ul>
      </div>

      <div class="goods-list" ref="goodsList">
        <ul>
          <li v-for="(g,index) in goods" :key="index" ref="goodList">
            <h3 class="goods-section-header">{{g.name}}</h3>
            <ul class="foods-list">
              <GoodListItem
                v-for="(f,i) in g.foods"
                :food="f"
                :key="i"
                @add-count="addFoodToShopCart"
                @minus-count="removeFoodToShopCart"
              />
            </ul>
          </li>
        </ul>
      </div>
    </div>
    <!-- 购物车 -->
    <ShopCart
      :seller="seller"
      :goods="goods"
      @add-count="addFoodToShopCart"
      @minus-count="removeFoodToShopCart"
      @empty="emptyShopCart"
    />

    <router-view @add-count="addFoodToShopCart" @minus-count="removeFoodToShopCart" />
  </div>
</template>

<script>
import SupportIcon from "../../components/SupportIcon";
import GoodListItem from "./GoodListItem";
import ShopCart from "./ShopCart";
import BScroll from "better-scroll";

/*
 *@desc 网络请求图片
 *@constant {string}
 */
const NETWORK = "network";
/*
 *@desc 网络异常图片
 *@constant {string}
 */
const ERROR = "error";

export default {
  props: {
    seller: Object,
  },
  data() {
    return {
      goods: [],
      loading: false,
      refreshText: false,
      image: NETWORK,
      currentIndex: 0,
    };
  },
  created() {
    this.getGoodsFromServer();
  },
  methods: {
    async getGoodsFromServer() {
      // 设置开始网络请求的状态
      this.startFetch();

      let res = await this.axios("/api/goods");
      console.log(res.data.data);

      if (res.status === 200 && res.data.code === 1) {
        this.goods = res.data.data;
        // 请求失成功隐藏加载的van-empty页面
        this.fetchSuccess();
        // 实现页面手势滑动
        this.initalBScoller();
      } else {
        // 请求失败设置页面的状态
        this.fetchFailure();
      }
    },
    startFetch() {
      this.loading = true; // 开始网络请求
      this.image = NETWORK;
      this.refreshText = false;
    },
    fetchSuccess() {
      this.loading = false; // 网络请求结束
    },
    fetchFailure() {
      this.image = ERROR; // 将图片渲染成error
      this.refreshText = true;
    },
    refreshData() {
      // 函数防抖
      if (this.timer) {
        clearTimeout(this.timer);
      }

      this.timer = setTimeout(() => {
        this.getGoodsFromServer();
        this.timer = null;
      }, 300);
    },
    initalBScoller() {
      // 当网络请求完毕更新goods之后,实例化better-scroll.让我们的菜单实现跟手势滑动
      // 注意数据更新完毕后,页面需要重新渲染nextTick可以保证页面渲染完毕
      this.$nextTick(() => {
        // 因为该方法在 getGoodsFromServer函数中被调用,刷新数据时,该方法也会被调用.为了避免多次实例化BScroll造成内存泄漏
        if (!this.menuScroll) {
          this.menuScroll = new BScroll(this.$refs.menuList, {
            click: true, // 允许BScroll内部元素被点击,默认不允许点击
          });
        } else {
          this.menuScroll.refresh(); //刷新自身,重新计算内部元素的高度
        }

        // 商品BScroll初始化
        if (!this.goodsScroll) {
          this.goodsScroll = new BScroll(this.$refs.goodsList, {
            click: true, // 允许BScroll内部元素被点击,默认不允许点击
          });
          this.goodsScroll.on("scrollEnd", this.scrollEndHande);
        } else {
          this.goodsScroll.refresh();
        }
      });
    },
    // 点击菜单栏有边商品滑动到指定分类区域
    scrollToFoods(index) {
      this.currentIndex = index;
      // console.log(this.$refs.goodList[index])
      this.goodsScroll.scrollToElement(this.$refs.goodList[index], 300);
    },
    // 商品栏滑动结束结束的回调
    scrollEndHande({ y }) {
      // 对偏移量取绝对值
      y = Math.abs(y);

      for (let i = 0; i < this.$refs.goodList.length; i++) {
        // 解决数组越界,
        if (i + 1 >= this.$refs.goodList.length) {
          this.currentIndex = i;
          break;
        }

        let top = this.$refs.goodList[i].offsetTop;
        let nextTop = this.$refs.goodList[i + 1].offsetTop;

        if (y >= top && y < nextTop) {
          this.currentIndex = i;
          break;
        }
      }
    },
    // 将商品添加到购物车
    addFoodToShopCart({ name }) {
      console.log("将该商品的数量加1", name);
      // 遍历所有商品将所有同名商品数量加1
      // 这里需要双重循环,第一层遍历是遍历商品分类
      for (let i = 0; i < this.goods.length; i++) {
        let { foods } = this.goods[i];
        // 第二层循环遍历每一个商品,找到对应同名商品,注意同一个商品在一个分类中至多只有一个,所以这里可以使用find方法
        let result = foods.find((f) => f.name === name);
        // 第一次将商品添加到购物车,需要给商品对象添加一个新的属性(vue直接给对象添加新属性不会引起页面更新)解决方法this.$set
        if (result && !result.count) {
          this.$set(result, "count", 1);
        } else if (result && result.count) {
          result.count++;
        }
        continue;
      }
    },
    // 将商品从购物车移除一个
    removeFoodToShopCart({ name }) {
      // 遍历所有商品将所有同名商品数量加1
      // 这里需要双重循环,第一层遍历是遍历商品分类
      for (let i = 0; i < this.goods.length; i++) {
        let { foods } = this.goods[i];
        // 第二层循环遍历每一个商品,找到对应同名商品,注意同一个商品在一个分类中至多只有一个,所以这里可以使用find方法
        let result = foods.find((f) => f.name === name);
        // 移除商品，商品的count属性是一定存在的
        if (result) {
          result.count--;
        }
        continue;
      }
    },
    emptyShopCart() {
      this.goods.forEach((item) => {
        item.foods.forEach((f) => {
          if (f.count) {
            f.count = 0;
          }
        });
      });
    },
  },
  beforeDestory() {
    // BScroll不属于vue,他是一个有副作用的DOM操作,所以当前组件被卸载时请回收该实例
    if (this.menuScroll) {
      this.menuScroll.destroy();
    }

    if (this.goodsScroll) {
      this.goodsScroll.destroy();
    }
  },
  components: {
    SupportIcon,
    GoodListItem,
    ShopCart,
  },
};
</script>

<style lang="scss" scoped>
.good-view {
  position: fixed;
  top: 180px;
  right: 0;
  bottom: 0;
  left: 0;

  .goods-container {
    display: flex;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 46px;
    left: 0;
  }

  .menu-list {
    overflow: hidden;
    flex: 0 0 80px;
    height: 100%;

    .menu-list-item {
      display: table;
      position: relative;
      padding: 0 12px;
      width: 80px;
      height: 54px;
      background-color: #f3f5f7;

      &.active {
        background-color: #fff;
      }

      &:after {
        display: block;
        position: absolute;
        right: 12px;
        left: 12px;
        height: 1px;
        background-color: rgba(7, 17, 27, 0.1);
        content: " ";
      }

      .menu-list-item-text {
        display: table-cell;
        font-size: 12px;
        line-height: 12px;
        vertical-align: middle;
      }
    }
  }

  .goods-list {
    overflow: hidden;
    flex: 1;
    height: 100%;

    .goods-section-header {
      border-left: 2px solid #d9dde1;
      padding-left: 14px;
      height: 26px;
      font-size: 12px;
      line-height: 26px;
      color: rgb(147, 153, 159);
      background-color: #f3f5f7;
    }

    .foods-list {
      padding: 0 18px;
    }
  }

  .refresh-text {
    color: #aaa;

    .refresh {
      color: blue;
      text-decoration: underline;
    }
  }
}
</style>