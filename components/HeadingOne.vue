<template>
  <h1 class="title is-1">{{label}}</h1>
</template>

<script>
export default {
  name: 'HeadingOne',
  props: {
    label: {
      type: String,
      required: true
    }
  }
}
</script>