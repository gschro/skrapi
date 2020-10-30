<template>
  <div>
    <navbar title="Skrapi" :editName="editName" :editPath="editPath"></navbar>
    <section class="main-content columns">
      <nuxt />
    </section>
  </div>
</template>

<script>
import Navbar from '~/components/Navbar'
import editLabels from '~/mixins/editLabels'

export default {
  mixins: [editLabels],
  components: {
    Navbar
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
        }
      ]
    }
  }
}
</script>
