<template>
    <select
      class="base-select"
      v-bind="$attrs"
      :multiple="multiple"
      :disabled="disabled"
      :required="required"
      :name="name"
      :id="id"
      :autocomplete="autocomplete"
      :value="modelValue"
      @change="
        $emit('update:modelValue', multiple ? [...$event.target.selectedOptions].map(o => o.value) : $event.target.value)
      "
    >
      <option v-if="placeholder" value="" disabled selected hidden>
        {{ placeholder }}
      </option>
      <option v-for="(option, index) in options" :key="index" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </template>
  

<script setup>
defineProps({
  modelValue: [String, Number, Array], // Supports single or multiple selections
  options: { type: Array, required: true }, // Expects an array of options
  multiple: Boolean,
  placeholder: String,
  disabled: Boolean,
  required: Boolean,
  name: String,
  id: String,
  class: String,
  autocomplete: String,
});

defineEmits(["update:modelValue"]); // Emits update event for v-model
</script>

<style lang="scss" scoped>
.base-select {
    width: 100%;
    font-size: 14px;
    line-height: 100%;
    padding: 0.75rem 1rem;
    outline: none;
    border: none;
    border: 0px;
}
</style>