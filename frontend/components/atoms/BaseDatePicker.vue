<template>
  <div class="base-date-picker-wrapper" :class="$attrs.class">
    <BaseLabel v-if="label" :label="label" :for="id" />
    <input
      class="base-date-picker"
      v-bind="$attrs"
      type="date"
      :value="modelValue"
      :name="name"
      :id="id"
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
  modelValue: String, // Expecting a date string like "YYYY-MM-DD"
  name: String,
  id: String,
  class: String,
  required: Boolean,
  disabled: Boolean,
  min: Number,
  max: Number,
  label: {
    type: String,
    default: ''
  }
});

defineEmits(["update:modelValue"]);
</script>

<style scoped lang="scss">
.base-date-picker {
  font-family: Tahoma;
  width: 100%;
  font-size: 14px;
  line-height: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid $grey;
}
</style>


