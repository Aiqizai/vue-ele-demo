<template>
  <span v-if="type >= 0" :class="[classNameMap[type],'kind-'+kind]"/>
</template>

<script>
export default {
  props: {
    type: {
      type: Number,
      default: -1,
    },
    kind: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      classNameMap: ["decrease", "discount", "special", "invoice", "guarantee"],
    };
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/styles/mixins";
$iconPath: "../assets/images/";
$classNames: decrease discount special invoice guarantee;

@each $type in $classNames {
  .#{$type} {
    vertical-align: top;

    &.kind-1 {
      @include bg-img($iconPath + $type + "_1", 12px, 12px);
    }

    &.kind-2 {
      @include bg-img($iconPath + $type + "_2", 16px, 16px);
    }

    &.kind-3 {
      @include bg-img($iconPath + $type + "_3", 12px, 12px);
    }

    &.kind-4 {
      @include bg-img($iconPath + $type + "_4", 16px, 16px);
    }
  }
}
</style>