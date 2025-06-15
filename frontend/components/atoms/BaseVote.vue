<template>
  <span :class="['vote', type]">{{ count.toString().padStart(3, '0') }}</span>
</template>

<script>
export default {
  name: 'BaseVote',
  props: {
    count: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      required: true,
      validator: (value) => ['upvotes', 'downvotes'].includes(value)
    }
  }
}
</script>

<style lang="scss" scoped>
.vote {
  color: currentColor;
  
  &:before {
    font-size: 15px;
    font-family: Arial;
    position: relative;
    right: 2px;
    line-height: 0;
  }
}

.upvotes {
  &:before {
    content: "▲";
  }
}

.downvotes {
  &:before {
    content: "▼";
  }
}
</style> 