<template>
  <input
    v-bind="$attrs"
    :id="id"
    class="base-input"
    :type="type"
    :placeholder="placeholder"
    :name="name"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script setup lang="ts">
defineProps({
  modelValue: {
    type: [String, Number],
    default: ""
  },
  type: { type: String, default: "text" }, // Default input type is text
  placeholder: {
    type: String,
    default: ""
  },
  disabled: Boolean,
  required: {
    type: Boolean,
    default: false
  },
  readonly: Boolean,
  name: {
    type: String,
    default: ""
  },
  id: {
    type: String,
    default: ""
  },
  autofocus: {
    type: Boolean,
    default: false
  },
  maxlength: {
    type: Number,
    default: 0
  },
  minlength: {
    type: Number,
    default: 0
  },
  pattern: {
    type: String,
    default: ""
  },
  step: {
    type: Number,
    default: 0
  },
  title: {
    type: String,
    default: ""
  }
})

defineEmits(["update:modelValue"]) // Emits input event for v-model
</script>

<style lang="scss" scoped>
.base-input {
  width: 100%;
  font-size: 14px;
  line-height: 100%;
  padding: 8px 12px;
  outline: none;
  border: 1px solid $grey;
}
</style>
