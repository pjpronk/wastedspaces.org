<template>
  <div class="base-select-wrapper">
    <BaseLabel v-if="label" :label="label" :for="id" />
    <select
      v-bind="$attrs"
      :id="id"
      class="base-select"
      :multiple="multiple"
      :disabled="disabled"
      :required="required"
      :name="name"
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
  </div>
</template>

<script setup>

defineProps({
  modelValue: {
    type: [String, Number, Array],
    default: ""
  },
  options: {
    type: Array,
    required: true
  },
  multiple: { type: Boolean, default: false },
  placeholder: {
    type: String,
    default: ""
  },
  disabled: Boolean,
  required: Boolean,
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
  autocomplete: {
    type: String,
    default: ""
  },
  label: {
    type: String,
    default: ''
  }
});

defineEmits(["update:modelValue"]); // Emits update event for v-model
</script>

<style lang="scss" scoped>
.base-select {
  width: 100%;
  font-size: 14px;
  line-height: 100%;
  padding: 8px 12px;
  outline: none;
  border: 1px solid $grey;
}

.base-select-wrapper {
  width: 100%;
}
</style>