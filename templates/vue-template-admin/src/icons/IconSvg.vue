<template>
  <svg class="svg-icon" aria-hidden="true">
    <use :xlink:href="symbolId" />
  </svg>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
});

const symbolId = computed(() => `#${props.name}`);
</script>
<style lang="scss" scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  stroke: currentColor;
  overflow: hidden;
}

.svg-icon:focus {
  outline: none;
}
</style>
