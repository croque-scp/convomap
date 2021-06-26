<template>
  <FieldGroup name="Option"></FieldGroup>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import FieldGroup from "./FieldGroup.vue"

export default defineComponent({
  name: "EditOption",
  components: {
    FieldGroup,
  },
})
</script>
