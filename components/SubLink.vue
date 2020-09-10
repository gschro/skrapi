<template>
  <h6 class="subtitle is-5">
    <nuxt-link :to="{ path }" exact-active-class="is-active">{{label}}</nuxt-link>
  </h6>
</template>

<script>
export default {
  name: 'SubLink',
  props: {
    path: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    }
  },
  computed: {
    lowerName () {
      return name.toLowerCase()
    }
  }
}
</script>