<template>
  <div class="btn-control" @click.stop="">
    <span class="icon-remove_circle_outline btn" @click="minusCount" v-show="count>0"></span>
    <span class="btn-count" v-show="count>0">{{count}}</span>
    <span class="icon-add_circle btn" @click="addCount"></span>
  </div>
</template>

<script>
export default {
  props: {
    food: {
      type: Object,
      require: true
    }
  },
  computed: {
      count() {
        // 计算属性判断当前商品添加到购物车的数量
        // 一开始所有商品都是没有被添加到购物车中的, 没有count的food 购物车中的值都为0
        return this.food.count || 0
      }
  },
  methods: {
      addCount() {
          // 因为food是父组件传过来的,vue是单向数据流.子组件不能直接修改props
          this.$emit('add-count')
      },
      minusCount() {
           this.$emit('minus-count')
      }
  }
};
</script>

<style lang="scss" scoped>
.btn-control {
  width: 72px;
  text-align: right;

  .btn-count,
  .btn {
    display: inline-block;
    width: 24px;
    height: 24px;
    line-height: 24px;
    vertical-align: top;
  }

  .btn-count {
    font-size: 10px;
    text-align: center;
    color: rgb(147, 153, 159);
  }

  .btn {
    font-size: 24px;
    color: rgb(0, 160, 220);
  }
}
</style>