<template>
  <div class="base-date-picker-wrapper" :class="$attrs.class">
    <BaseLabel v-if="label" :label="label" :for="id" />
    <input
      v-bind="$attrs"
      :id="id"
      class="base-date-picker"
      type="date"
      :value="modelValue"
      :name="name"
      :required="required"
      :disabled="disabled"
      :min="min"
      :max="max"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: ""
  },
  name: {
    type: String,
    default: ""
  },
  id: {
    type: String,
    default: ""
  },
  class: {
    type: String,
    default: ""
  },
  required: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  min: {
    type: String,
    default: "1900-01-01"
  },
  max: {
    type: String,
    default: ""
  },
  label: {
    type: String,
    default: ""
  }
})

defineEmits(["update:modelValue"])
</script>

<style scoped lang="scss">
.base-date-picker {
  font-family: Tahoma;
  width: 100%;
  font-size: 14px;
  line-height: 100%;
  padding: 8px 12px;
  border: 1px solid $grey;
}
</style>
