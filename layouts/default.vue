<template>
  <div>
    <navbar title="Skrapi"></navbar>
    <section class="main-content columns">
      <nuxt />
    </section>
  </div>
</template>

<script>
import Navbar from '~/components/Navbar'
import NavbarCenter from '~/components/NavbarCenter'

export default {
  components: {
    Navbar,
    NavbarCenter
  },
  data () {
    return {
      items: [
        {
          title: 'Home',
          icon: 'home',
          to: { name: 'index' }
        },
        {
          title: 'Inspire',
          icon: 'lightbulb',
          to: { name: 'inspire' }
        },
        {
          title: 'Parks',
          icon: 'lightbulb',
          to: { name: 'parks' }
        }
      ]
    }
  }
}
</script>
