
<template>
    <input
      class="base-input"
      v-bind="$attrs"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :readonly="readonly"
      :name="name"
      :id="id"
      :autocomplete="autocomplete"
      :autofocus="autofocus"
      :maxlength="maxlength"
      :minlength="minlength"
      :pattern="pattern"
      :step="step"
      :title="title"
      :value="modelValue"
      @input="$emit('update:modelValue')"
    />
  </template>
  

<script setup lang="ts">
defineProps({
  modelValue: [String, Number], // Supports v-model
  type: { type: String, default: "text" }, // Default input type is text
  placeholder: String,
  disabled: Boolean,
  required: Boolean,
  readonly: Boolean,
  name: String,
  id: String,
  autocomplete: String,
  autofocus: Boolean,
  maxlength: Number,
  minlength: Number,
  pattern: String,
  step: Number,
  title: String,
  value: [String, Number], // Allows value binding
});

defineEmits(["update:modelValue"]); // Emits input event for v-model
</script>

<style lang="scss" scoped>
.base-input {
    width: 100%;
    font-size: 14px;
    line-height: 100%;
    padding: 0.75rem 1rem;
    outline: none;
    border: none;
    border: 0px;
}
</style>
