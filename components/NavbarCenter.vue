<template>
    <nav class="level">
      <p class="level-item has-text-centered">
        <a class="link is-info">Home</a>
      </p>
      <p class="level-item has-text-centered">
        <a class="link is-info">Menu</a>
      </p>
      <p class="level-item has-text-centered">
        <img src="https://bulma.io/images/bulma-type.png" alt="" style="height: 30px;">
      </p>
      <p class="level-item has-text-centered">
        <a class="link is-info">Reservations</a>
      </p>
      <p class="level-item has-text-centered">
        <a class="link is-info">Contact</a>
      </p>
    </nav>
</template>

<style scoped>
  .brand-text {
    font-weight: bold;
    color: #714DD2;
  }
</style>

<script>
export default {
  props: {
    title: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    }
  }
}
</script>
