<template>
  <label>
    {{ label }}
    <select v-model="dropdownValue">
      <option v-for="speaker in speakers" :key="speaker">
        {{ speaker }}
      </option>
    </select>
  </label>
</template>

<!-- Currently only supports speakers but will support more TODO -->

<script lang="ts">
import { defineComponent } from "vue"
import { speakers } from "../lib/speakers"

export default defineComponent({
  name: "FieldDropdown",
  props: {
    label: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
  },
  emits: ["updateValue"],
  data() {
    return {
      speakers,
    }
  },
  computed: {
    dropdownValue: {
      get(): string {
        return this.value
      },
      set(input: string) {
        this.$emit("updateValue", input)
      },
    },
  },
})
</script>

<style lang="scss"></style>
