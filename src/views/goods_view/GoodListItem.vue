<template>
  <li class="good-list-item" @click="goGoodDetailView">
    <img class="food-avatar" :src="food.icon" />
    <div class="food-content">
      <h3 class="food-name">{{food.name}}</h3>
      <p v-if="food.description" class="food-desc">
        <span class="small-font">{{food.description}}</span>
      </p>
      <p class="food-desc">
        <span class="small-font">月售{{food.sellCount}} 好评{{food.rating}}%</span>
      </p>
      <p class="food-price">
        <i class="yuan">{{food.price}}</i>

        <span class="old-price" v-if="food.oldPrice">
          <i>{{food.oldPrice}}</i>
        </span>
      </p>
    </div>
    <div class="control-wrapper">
      <CountControl :food="food" @add-count="addCount" @minus-count="minusCount"/>
    </div>
  </li>
</template>

<script>
import CountControl from "./CountControl";
export default {
  props: {
    food: Object,
  },
  methods: {
    addCount() {
      // 这里我们发现food依然是父组件传过来的prop,单向数据流不可以直接修改
      // 继续反向传值
      this.$emit('add-count',this.food)
    },
    minusCount() {
      this.$emit('minus-count',this.food)
    },
    // 路由跳转至商品详情页
    goGoodDetailView() {
      this.$router.push({name: 'Detail', params: {food: this.food}})
    }
   },
  components: {
    CountControl,
  }
};
</script>

<style lang="scss" scoped>
.good-list-item {
  display: flex;
  position: relative;
  padding: 18px 0;

  &:after {
    display: block;
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    height: 1px;
    background: rgba(7, 17, 27, 0.1);
    content: "";
  }

  &:last-child::after {
    display: none;
  }

  .food-avatar {
    flex: 0 0 57px;
    margin-right: 10px;
    border-radius: 2px;
    width: 57px;
    height: 57px;
  }

  .food-content {
    flex: 1;
  }

  .food-name {
    padding-top: 2px;
    font-size: 14px;
    line-height: 14px;
    color: rgb(7, 17, 27);
  }

  .food-desc {
    overflow: hidden;
    margin-top: 8px;
    max-width: 40vw;
    height: 10px;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: rgb(147, 153, 159);

    .small-font {
      display: inline-block;
      width: 200%;
      height: 200%;
      font-size: 20px;
      line-height: 20px;
      transform-origin: left top;
      transform: scale(0.5);
    }
  }

  .food-price {
    font-size: 14px;
    color: red;
    line-height: 24px;

    .yuan {
      position: relative;
      margin-right: 8px;
      padding-left: 10px;
      font-weight: 700;
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
      height: 10px;
      color: rgb(147, 153, 159);
      i {
        position: absolute;
        font-size: 20px;
        height: 20px;
        transform-origin: left;
        transform: scale(0.5);
        &:before {
          content: "￥";
        }
      }
    }
  }

  .control-wrapper {
      position: absolute;
      right: 0;
      bottom: 18px;
  }
}
</style>