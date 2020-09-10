<template>
<div class="container">
  <section class="section">
    <div class="columns is-mobile is-multiline">
      <div v-for="(link, key) of links" :key="key" class="column is-2-desktop is-12-mobile small-gap">
        <nuxt-link
            :to="{ path: link.link }"
            class="button is-active is-large is-fullwidth"
            exact-active-class="is-active">
          {{link.label}}
        </nuxt-link>
      </div>
    </div>
  </section>
</div>
</template>

<style scoped>
.column.small-gap {
  padding: .4rem;
}
</style>

<script>

export default {
  name: 'EditPage',
  middleware: 'admin',
  data () {
    return {
     links: [{
       label: 'Model',
       link: '/edit/models'
     }]
    }
  }
}
</script>
