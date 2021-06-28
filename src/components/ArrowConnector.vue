<template>
  <path marker-end="url(#arrowhead)" :d="arrowPath" />
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue"
import { Edge, pointToCoords } from "../lib/graphLayout"

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
      return [
        "M",
        pointToCoords(this.points[0]),
        ...this.points.slice(1).flatMap((point) => ["L", pointToCoords(point)]),
      ].join(" ")
    },
  },
})
</script>
