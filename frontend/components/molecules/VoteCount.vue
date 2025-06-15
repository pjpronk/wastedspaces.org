<template>
  <div class="vote-count bold text-s">
    <BaseVote :count="upvotes" type="upvotes" />
    <BaseVote :count="downvotes" type="downvotes" />
  </div>
</template>

<script>
export default {
  name: 'VoteCount',
  props: {
    upvotes: {
      type: Number,
      default: 0
    },
    downvotes: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style lang="scss" scoped>
.vote-count {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  line-height: 100%;
  color: $primary-red;
}
</style>
