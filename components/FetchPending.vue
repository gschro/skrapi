<template>
  <div v-if="pending">
    <slot name="pending">{{theLabel}}</slot>
  </div>
  <div v-else>
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    pending: {
      type: Boolean,
      required: true
    },
    label: {
      type: String,
      required: false
    }
  },
  computed: {
    isPending: function () {
      return this.pending
    },
    theLabel: function () {
      return `Loading ${this.label}...`
    }
  }
}
</script>