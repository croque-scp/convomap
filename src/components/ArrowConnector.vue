<template>
  <path marker-end="url(#arrowhead)" :d="arrowPath" />
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue"
import { Edge } from "../lib/graphLayout"

export default defineComponent({
  name: "ArrowConnector",
  props: {
    points: {
      required: true,
      type: Array as PropType<Edge>,
    },
  },
  computed: {
    arrowPath(): string {
      if (this.points.length === 2) {
        return `
          M ${this.points[0].x} ${this.points[0].y}
          L ${this.points[1].x} ${this.points[1].y}
        `
      }
      if (this.points.length === 4) {
        return `
          M ${this.points[0].x} ${this.points[0].y}
          C ${this.points[1].x} ${this.points[1].y}
          , ${this.points[2].x} ${this.points[2].y}
          , ${this.points[3].x} ${this.points[3].y}
        `
      }
      throw new Error("ELK spline does not contain either 2 or 4 points")
    },
  },
})
</script>
